<?php
// Social Widget - PHP starter (PHP 8, standard library only, nothing to install).
// Renders the Tagembed gallery's posts as one finished HTML page. The token stays
// on this server; the browser only ever receives HTML.
//
// Settings (.env or the host's environment): ACCESS_TOKEN, API_BASE_URL, WIDGET_THEME.
// Look: themes/<WIDGET_THEME>.css + themes/<WIDGET_THEME>.template.html + themes/<WIDGET_THEME>.json,
// plus custom.css (optional) for your own changes. Same rules as guides/prompts/library/build/common.md
// and cache.md - this file is the "server.md" build already written and tested.

declare(strict_types=1);

const CACHE_TTL_SECONDS = 300; // 5 minutes: about 288 API calls a day, whatever the traffic

// ---------- settings ----------

/** getenv() first (cPanel, Docker...), else a tiny .env reader beside this file - no Composer. */
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
    $template = (string) file_get_contents(__DIR__ . "/themes/$slug.template.html");
    if (is_file(__DIR__ . '/custom.css')) {
        $css .= "\n  /* custom.css */\n" . file_get_contents(__DIR__ . '/custom.css');
    }
    // A theme with no {{author}} slot is photo-only (Collage, Slider, Reels, Single Post,
    // Horizontal Slider, Square Photo): a post with no image would be an empty card.
    $meta['photo_only'] = !str_contains($template, '{{author}}');
    return ['meta' => $meta, 'css' => $css, 'template' => $template];
}

function sw_samples(array $theme): array
{
    $file = ($theme['meta']['type'] ?? '') === 'review' ? 'sample-posts-reviews.json' : 'sample-posts-social.json';
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
    $lock = is_dir($dir) ? @fopen("$dir/posts.lock", 'c') : false;
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
        if (!is_dir($dir)) {
            // Cache folder could not be created: serve live instead of failing.
            error_log('[social-widget] Cache folder not writable, serving live');
        } else {
            // Write a temp file and rename it in, so a reader never sees half a file.
            $tmp = "$file." . getmypid() . '.tmp';
            if (@file_put_contents($tmp, json_encode(['saved_at' => time(), 'data' => $data])) === false || !@rename($tmp, $file)) {
                @unlink($tmp);
                error_log('[social-widget] Cache folder not writable, serving live');
            }
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

// ---------- rendering (fills the theme's own {{slot}} template - same markup as preview.html) ----------

const SW_NET_MARK = [
    'instagram' => 'IG', 'facebook' => 'f', 'twitter' => 'X', 'x' => 'X', 'tiktok' => '♪', 'youtube' => '▶',
    'linkedin' => 'in', 'pinterest' => 'P', 'google' => 'G', 'yelp' => 'y', 'tripadvisor' => 'T', 'trustpilot' => '★',
];

function e(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Links: only http/https, never javascript: or data:. */
function sw_safe_link(mixed $url): string
{
    return is_string($url) && preg_match('#^https?://#i', $url) ? $url : '#';
}

/** Media src: http/https (live API) or a data: image (the bundled sample posts). */
function sw_safe_media(mixed $url): string
{
    return is_string($url) && preg_match('#^(https?://|data:image/)#i', $url) ? $url : '';
}

function sw_first_char(string $s): string
{
    $c = function_exists('mb_substr') ? mb_substr($s, 0, 1) : substr($s, 0, 1);
    return function_exists('mb_strtoupper') ? mb_strtoupper($c) : strtoupper($c);
}

/** The FIRST media entry of type "image" - never media[0], which can be a video. */
function sw_first_image(array $media): ?array
{
    foreach ($media as $m) {
        if (is_array($m) && ($m['type'] ?? '') === 'image' && sw_safe_media($m['cdn_url'] ?? null) !== '') {
            return $m;
        }
    }
    return null;
}

function sw_media_html(array $post, ?array $image): string
{
    if (!$image) {
        return '';
    }
    $media = is_array($post['media'] ?? null) ? $post['media'] : [];
    $hasVideo = (bool) array_filter($media, fn($m) => is_array($m) && ($m['type'] ?? '') === 'video' && sw_safe_media($m['cdn_url'] ?? null) !== '');
    if ($hasVideo) {
        $video = null;
        foreach ($media as $m) {
            if (is_array($m) && ($m['type'] ?? '') === 'video' && sw_safe_media($m['cdn_url'] ?? null) !== '') {
                $video = $m;
                break;
            }
        }
        return '<video controls muted playsinline preload="none" poster="' . e($image['cdn_url']) . '">'
            . '<source src="' . e($video['cdn_url']) . '"></video>';
    }
    return '<img src="' . e($image['cdn_url']) . '" alt="" loading="lazy">';
}

/** Fill the theme's own {{slot}} template for one post - per common.md's "Per post" rules. */
function sw_card(string $template, array $post): string
{
    $author = is_array($post['author'] ?? null) ? $post['author'] : [];
    $network = is_array($post['network'] ?? null) ? $post['network'] : [];
    $media = is_array($post['media'] ?? null) ? $post['media'] : [];
    $source = is_array($post['source'] ?? null) ? $post['source'] : [];
    $content = is_array($post['content'] ?? null) ? $post['content'] : [];

    $name = (string) ($author['name'] ?? '') ?: (string) ($author['handle'] ?? '');
    $netName = (string) ($network['name'] ?? '');
    $netSlug = strtolower((string) ($network['slug'] ?? ''));
    $image = sw_first_image($media);

    $initial = sw_first_char($name !== '' ? $name : $netName);
    $avatarUrl = sw_safe_media($author['avatar_url'] ?? null);
    $avatar = $avatarUrl !== ''
        ? '<img class="tbd-avatar" src="' . e($avatarUrl) . '" alt="" loading="lazy">'
        : '<span class="tbd-avatar">' . e($initial) . '</span>';

    $ts = strtotime((string) ($post['created_at'] ?? ''));
    $date = $ts ? gmdate('M j, Y', $ts) : '';

    $rating = $post['rating'] ?? null;
    $ratingInt = is_numeric($rating) ? (int) round((float) $rating) : 0;
    $stars = $ratingInt >= 1 && $ratingInt <= 5 ? str_repeat('★', $ratingInt) . str_repeat('☆', 5 - $ratingInt) : '';

    $text = (string) ($content['text'] ?? '');

    $slots = [
        '{{permalink}}' => e(sw_safe_link($source['permalink'] ?? null)),
        '{{network_name}}' => e($netName),
        '{{network_slug}}' => e($netSlug),
        '{{network_mark}}' => e(SW_NET_MARK[$netSlug] ?? sw_first_char($netName)),
        '{{author}}' => e($name),
        '{{avatar}}' => $avatar,
        '{{created_at}}' => e($post['created_at'] ?? ''),
        '{{date}}' => e($date),
        '{{text}}' => $text !== '' ? e($text) : '',
        '{{rating}}' => (string) $ratingInt,
        '{{stars}}' => $stars,
        '{{media}}' => sw_media_html($post, $image),
        '{{media_width}}' => $image ? (string) (int) ($image['width'] ?? 0) : '0',
        '{{media_height}}' => $image ? (string) (int) ($image['height'] ?? 0) : '0',
    ];

    return strtr($template, $slots);
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
$posts = array_values(array_filter($data['posts'] ?? [], 'is_array'));

// Photo-only themes skip posts without an image - they would be empty cards.
if (!empty($meta['photo_only'])) {
    $posts = array_values(array_filter($posts, fn($p) => sw_first_image(is_array($p['media'] ?? null) ? $p['media'] : []) !== null));
}

$isSlider = ($meta['layout'] ?? '') === 'slider';
$cards = implode("\n", array_map(fn($p) => sw_card($theme['template'], $p), $posts));

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
<?= $theme['css'] ?>
</style>
</head>
<body>
<section class="tbd-widget tbd-t-<?= e($meta['slug']) ?> tbd-l-<?= e($meta['layout']) ?><?= !empty($meta['clamp']) ? ' tbd-clamp' : '' ?>">
  <h1 class="tbd-header">Social Widget</h1>
<?php if (!empty($data['sample'])): ?>
  <p class="tbd-note">Sample posts - set ACCESS_TOKEN in .env to show your gallery.</p>
<?php endif; ?>
<?php if (!$posts): ?>
  <p class="tbd-empty">No posts to show yet.</p>
<?php else: ?>
<?php if ($isSlider): ?>
  <div class="tbd-slider">
  <button class="tbd-arrow tbd-arrow--prev" type="button" data-dir="-1" aria-label="Previous">‹</button>
<?php endif; ?>
  <div class="tbd-track">
    <?= $cards ?>
  </div>
<?php if ($isSlider): ?>
  <button class="tbd-arrow tbd-arrow--next" type="button" data-dir="1" aria-label="Next">›</button>
  </div>
<?php endif; ?>
<?php endif; ?>
</section>
<?php if ($isSlider): ?>
<script>
  // Arrows scroll the row by one view. No data is fetched.
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.tbd-arrow');
    if (!b) return;
    var t = b.parentNode.querySelector('.tbd-track');
    t.scrollBy({ left: b.dataset.dir * t.clientWidth, behavior: 'smooth' });
  });
</script>
<?php endif; ?>
</body>
</html>
