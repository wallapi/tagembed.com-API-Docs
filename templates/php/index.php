<?php
// Social Widget - PHP starter (PHP 8, nothing to install).
// Renders the Tagembed gallery's posts as one finished HTML page. The token stays
// on this server; the browser only ever receives HTML.
//
// Settings (.env or the host's environment): ACCESS_TOKEN, API_BASE_URL, WIDGET_THEME.
// Look: themes/<WIDGET_THEME>.css, plus custom.css (optional) for your own changes.

declare(strict_types=1);

const CACHE_TTL_SECONDS = 300; // 5 minutes: about 288 API calls a day, whatever the traffic

// ---------- settings ----------

/** getenv() first (cPanel, Docker...), else a tiny .env reader - no Composer needed. */
function sw_env(string $key, string $default = ''): string
{
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }
    static $file = null;
    if ($file === null) {
        $file = [];
        $path = __DIR__ . '/.env';
        if (is_readable($path)) {
            foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                    continue;
                }
                [$k, $v] = array_map('trim', explode('=', $line, 2));
                $file[$k] = trim($v, "\"'");
            }
        }
    }
    return $file[$key] ?? $default;
}

// ---------- theme ----------

function sw_theme(): array
{
    $slug = strtolower(trim(sw_env('WIDGET_THEME', 'modern-card')));
    if (!preg_match('/^[a-z-]+$/', $slug) || !is_file(__DIR__ . "/themes/$slug.json")) {
        error_log("[social-widget] Unknown WIDGET_THEME \"$slug\" - using modern-card");
        $slug = 'modern-card';
    }
    $meta = json_decode((string) file_get_contents(__DIR__ . "/themes/$slug.json"), true);
    $css = (string) file_get_contents(__DIR__ . "/themes/$slug.css");
    if (is_file(__DIR__ . '/custom.css')) {
        $css .= "\n  /* custom.css */\n" . file_get_contents(__DIR__ . '/custom.css');
    }
    return ['meta' => $meta, 'css' => $css];
}

function sw_samples(array $theme): array
{
    $file = ($theme['meta']['type'] ?? '') === 'review' ? 'reviews.json' : 'social.json';
    return json_decode((string) file_get_contents(__DIR__ . "/samples/$file"), true) ?: [];
}

// ---------- API + cache ----------

function sw_fetch_posts(string $base, string $token): array
{
    $url = "$base/v3/posts?limit=24";
    $headers = ["Authorization: Bearer $token", 'Accept: application/json'];
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $headers, CURLOPT_TIMEOUT => 10]);
        $raw = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($raw === false) {
            throw new RuntimeException('Tagembed API request failed: ' . curl_error($ch));
        }
    } else {
        $ctx = stream_context_create(['http' => ['header' => implode("\r\n", $headers), 'timeout' => 10, 'ignore_errors' => true]]);
        $raw = @file_get_contents($url, false, $ctx);
        if ($raw === false) {
            throw new RuntimeException('Tagembed API request failed');
        }
        $code = preg_match('/\s(\d{3})/', $http_response_header[0] ?? '', $m) ? (int) $m[1] : 0;
    }
    $json = json_decode((string) $raw, true);
    // Check the HTTP status AND the envelope flag: status can be false on a 200.
    if ($code < 200 || $code >= 300 || !is_array($json) || ($json['status'] ?? true) === false) {
        $detail = $code === 422 ? json_encode($json['body']['fields'] ?? null) : ($json['message'] ?? 'unexpected response');
        throw new RuntimeException("Tagembed API $code: $detail");
    }
    $body = is_array($json['body'] ?? null) ? $json['body'] : [];
    return ['posts' => is_array($body['posts'] ?? null) ? $body['posts'] : [], 'paging' => $body['paging'] ?? null];
}

function sw_read_cache(string $file): ?array
{
    $c = is_readable($file) ? json_decode((string) @file_get_contents($file), true) : null;
    return is_array($c) && isset($c['data']) ? $c : null;
}

function sw_get_posts(array $theme): array
{
    $token = trim(sw_env('ACCESS_TOKEN'));
    // No token yet: show the sample posts, touch neither the API nor the cache.
    if ($token === '') {
        return ['posts' => sw_samples($theme), 'paging' => null, 'sample' => true];
    }
    $base = rtrim(trim(sw_env('API_BASE_URL', 'https://api.tagembed.com/api')), '/');
    $dir = __DIR__ . '/cache';
    $file = "$dir/posts.json";

    $cached = sw_read_cache($file);
    if ($cached && time() - (int) $cached['saved_at'] < CACHE_TTL_SECONDS) {
        return $cached['data'];
    }

    // One refresh at a time: whoever gets the lock refreshes, the rest serve the old copy.
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    $lock = @fopen("$dir/posts.lock", 'c');
    if ($lock && !flock($lock, LOCK_EX | LOCK_NB)) {
        if ($cached) {
            fclose($lock);
            return $cached['data'];
        }
        flock($lock, LOCK_EX); // nothing to serve yet - wait for the other refresh
        $fresh = sw_read_cache($file);
        if ($fresh && time() - (int) $fresh['saved_at'] < CACHE_TTL_SECONDS) {
            fclose($lock);
            return $fresh['data'];
        }
    }

    try {
        $data = sw_fetch_posts($base, $token);
        // Write a temp file and rename it in, so a reader never sees half a file.
        $tmp = "$file." . getmypid() . '.tmp';
        if (@file_put_contents($tmp, json_encode(['saved_at' => time(), 'data' => $data])) === false || !@rename($tmp, $file)) {
            @unlink($tmp);
            error_log('[social-widget] Cache folder not writable, serving live');
        }
    } catch (Throwable $e) {
        error_log('[social-widget] ' . $e->getMessage());
        // A failed refresh keeps serving the old copy; empty only if nothing ever loaded.
        $data = $cached ? $cached['data'] : ['posts' => [], 'paging' => null];
    }
    if ($lock) {
        fclose($lock);
    }
    return $data;
}

// ---------- HTML (same markup as preview.html) ----------

const SW_NET_MARK = [
    'instagram' => 'IG', 'facebook' => 'f', 'twitter' => 'X', 'x' => 'X', 'tiktok' => '♪', 'youtube' => '▶',
    'linkedin' => 'in', 'pinterest' => 'P', 'google' => 'G', 'yelp' => 'y', 'tripadvisor' => 'T', 'trustpilot' => '★',
];

function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Only http(s) links and images - never javascript: or data: from the API. */
function sw_safe_url(mixed $url): string
{
    return is_string($url) && preg_match('#^https?://#i', $url) ? $url : '';
}

function sw_first_char(string $s): string
{
    $c = function_exists('mb_substr') ? mb_substr($s, 0, 1) : substr($s, 0, 1);
    return function_exists('mb_strtoupper') ? mb_strtoupper($c) : strtoupper($c);
}

function sw_card(array $post, array $parts): string
{
    $author = is_array($post['author'] ?? null) ? $post['author'] : [];
    $network = is_array($post['network'] ?? null) ? $post['network'] : [];
    $name = (string) ($author['name'] ?? '') ?: (string) ($author['handle'] ?? '');
    $netName = (string) ($network['name'] ?? '');
    $slug = strtolower((string) ($network['slug'] ?? ''));
    $media = is_array($post['media'] ?? null) ? $post['media'] : [];
    $blocks = [];

    // The first media entry of type "image" - never media[0], which can be a video.
    $image = null;
    if (in_array('media', $parts, true)) {
        foreach ($media as $m) {
            if (($m['type'] ?? '') === 'image' && sw_safe_url($m['cdn_url'] ?? null)) {
                $image = $m;
                break;
            }
        }
    }
    if ($image) {
        $style = !empty($image['width']) && !empty($image['height'])
            ? '--tbd-ar:' . (int) $image['width'] . ' / ' . (int) $image['height'] . ';' : '';
        $thumb = $image['preview_data_uri'] ?? '';
        if (is_string($thumb) && str_starts_with($thumb, 'data:image/')) {
            $style .= "--tbd-ph:url($thumb)";
        }
        $hasVideo = (bool) array_filter($media, fn($m) => ($m['type'] ?? '') === 'video');
        $blocks['media'] = '<div class="tbd-media" data-network="' . e($netName) . '"' . ($style ? ' style="' . e($style) . '"' : '') . '>'
            . '<img src="' . e($image['cdn_url']) . '" alt="" loading="lazy">' . ($hasVideo ? '<span class="tbd-play"></span>' : '') . '</div>';
    }

    $initial = e(sw_first_char($name));
    $avatar = sw_safe_url($author['avatar_url'] ?? null)
        ? '<img class="tbd-avatar" src="' . e($author['avatar_url']) . '" alt="" loading="lazy" data-initial="' . $initial . '">'
        : '<span class="tbd-avatar">' . $initial . '</span>';
    $ts = strtotime((string) ($post['created_at'] ?? ''));
    $blocks['head'] = '<div class="tbd-head">' . $avatar . '<div class="tbd-who">'
        . ($name !== '' ? '<span class="tbd-author">' . e($name) . '</span>' : '')
        . '<time class="tbd-date" datetime="' . e($post['created_at'] ?? '') . '">' . ($ts ? gmdate('M j, Y', $ts) : '') . '</time></div>'
        . '<span class="tbd-net" data-net="' . e($slug) . '" data-mark="' . e(SW_NET_MARK[$slug] ?? sw_first_char($netName)) . '" title="' . e($netName) . '"></span></div>';

    $rating = (int) round((float) ($post['rating'] ?? 0));
    if ($rating >= 1 && $rating <= 5) {
        $blocks['stars'] = '<div class="tbd-stars" aria-label="' . $rating . ' out of 5">'
            . str_repeat('★', $rating) . str_repeat('☆', 5 - $rating) . '</div>';
    }
    $text = $post['content']['text'] ?? '';
    if (is_string($text) && $text !== '') {
        $blocks['text'] = '<p class="tbd-text">' . e($text) . '</p>';
    }

    $inner = implode("\n      ", array_values(array_filter(array_map(fn($p) => $blocks[$p] ?? '', $parts))));
    $cls = $image || !in_array('media', $parts, true) ? 'tbd-card' : 'tbd-card tbd-card--text';
    $href = sw_safe_url($post['source']['permalink'] ?? null) ?: '#';
    return "    <a class=\"$cls\" href=\"" . e($href) . "\" target=\"_blank\" rel=\"noopener noreferrer\">\n      $inner\n    </a>";
}

/** Rating Badge / Badge: the average of every rated post, its stars and the count. */
function sw_badge(array $posts): string
{
    $rated = array_values(array_filter($posts, fn($p) => is_array($p) && is_numeric($p['rating'] ?? null)
        && !is_string($p['rating']) && $p['rating'] >= 1 && $p['rating'] <= 5));
    $nets = [];
    foreach ($rated as $p) {
        $slug = (string) ($p['network']['slug'] ?? '');
        if ($slug !== '' && !isset($nets[$slug])) {
            $nets[$slug] = (string) ($p['network']['name'] ?? '');
        }
    }
    $count = count($rated);
    $avg = $count ? array_sum(array_column($rated, 'rating')) / $count : 0;
    $title = count($nets) === 1 ? reset($nets) . ' Reviews' : 'Customer Reviews';
    $full = (int) floor($avg + 0.5);
    $marks = '';
    foreach ($nets as $slug => $name) {
        $marks .= '<span class="tbd-net" data-net="' . e($slug) . '" data-mark="' . e(SW_NET_MARK[$slug] ?? sw_first_char($name)) . '" title="' . e($name) . '"></span>';
    }
    $a = number_format($avg, 1);
    return "  <div class=\"tbd-badge\">\n"
        . "    <div class=\"tbd-badge-nets\">$marks</div>\n"
        . '    <div class="tbd-badge-title">' . e($title) . "</div>\n"
        . "    <div class=\"tbd-badge-score\"><span class=\"tbd-badge-avg\">$a</span>"
        . "<span class=\"tbd-stars\" aria-label=\"$a out of 5\">" . str_repeat('★', $full) . str_repeat('☆', 5 - $full) . "</span></div>\n"
        . "    <div class=\"tbd-badge-count\">Based on $count review" . ($count === 1 ? '' : 's') . "</div>\n"
        . '  </div>';
}

// ---------- page ----------

$theme = sw_theme();
$meta = $theme['meta'];
try {
    $data = sw_get_posts($theme);
} catch (Throwable $e) {
    error_log('[social-widget] ' . $e->getMessage());
    $data = ['posts' => [], 'paging' => null];
}
$posts = $data['posts'] ?? [];
// Photo-only themes skip posts without an image - they would be empty cards.
if ($meta['parts'] === ['media']) {
    $posts = array_values(array_filter($posts, fn($p) => is_array($p) && (bool) array_filter(
        is_array($p['media'] ?? null) ? $p['media'] : [],
        fn($m) => is_array($m) && ($m['type'] ?? '') === 'image' && sw_safe_url($m['cdn_url'] ?? null)
    )));
}
$slider = ($meta['layout'] ?? '') === 'slider' && $posts;
$cards = implode("\n", array_map(fn($p) => sw_card(is_array($p) ? $p : [], $meta['parts']), $posts));
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Social Widget</title>
<?php if (!empty($meta['font_url'])): ?>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="<?= e($meta['font_url']) ?>">
<?php endif; ?>
<style>
<?= $theme['css'] ?></style>
</head>
<body>
<section class="tbd-widget tbd-t-<?= e($meta['slug']) ?> tbd-l-<?= e($meta['layout']) ?><?= !empty($meta['clamp']) ? ' tbd-clamp' : '' ?>">
  <h1 class="tbd-header">Social Widget</h1>
<?php if (!empty($data['sample'])): ?>
  <p class="tbd-note">Sample posts - set ACCESS_TOKEN in .env to show your gallery.</p>
<?php endif; ?>
<?php if (!$posts): ?>
  <p class="tbd-empty">No posts to show yet.</p>
<?php elseif (($meta['layout'] ?? '') === 'badge'): ?>
<?= sw_badge($posts) ?>

<?php else: ?>
<?php if ($slider): ?>
  <div class="tbd-slider">
  <button class="tbd-arrow tbd-arrow--prev" type="button" data-dir="-1" aria-label="Previous">‹</button>
<?php endif; ?>
  <div class="tbd-track">
<?= $cards ?>

  </div>
<?php if ($slider): ?>
  <button class="tbd-arrow tbd-arrow--next" type="button" data-dir="1" aria-label="Next">›</button>
  </div>
<?php endif; ?>
<?php endif; ?>
</section>
<?php if ($slider): ?>
<script>
  // Arrows scroll the row by one view.
  document.querySelectorAll('.tbd-arrow').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.parentNode.querySelector('.tbd-track');
      t.scrollBy({ left: b.dataset.dir * t.clientWidth, behavior: 'smooth' });
    });
  });
</script>
<?php endif; ?>
</body>
</html>
