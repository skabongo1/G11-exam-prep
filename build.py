#!/usr/bin/env python3
"""Builds the installable G11 Exam Prep web app from the course sources.
Usage: python3 build.py <sources_dir>
Writes index.html, sw.js and manifest.webmanifest next to this script.
Each build gets a new version, so installed apps pick up the update."""
import sys, os, json, datetime

SRC = sys.argv[1]
OUT = os.path.dirname(os.path.abspath(__file__))
VERSION = datetime.datetime.now(datetime.timezone.utc).strftime('%Y.%m.%d-%H%M')

shell = open(os.path.join(SRC, 'shell.html'), encoding='utf-8').read()
cut = shell.index('</style>') + len('</style>')
head_part, body_part = shell[:cut], shell[cut:]

scripts = ''
for f in ['content.js', 'content2.js', 'content3.js', 'content4.js', 'content5.js', 'series.js', 'scenarios.js', 'guides.js', 'reader.js', 'app.js']:
    scripts += '\n<script>\n' + open(os.path.join(SRC, f), encoding='utf-8').read() + '\n</script>'

pwa_head = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#14203a">
<meta name="description" content="Independent ICC G11 General Building Contractor (A) exam preparation.">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="G11 Prep">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
'''

pwa_tail = f'''
<div id="upd" class="updbar" role="status" hidden><span>A new version of G11 Exam Prep is ready.</span><button class="btn sm" id="updGo">Update now</button></div>
<style>.updbar{{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:70;display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:var(--paper);color:var(--ink);border:2px solid var(--d3);border-radius:12px;padding:10px 14px;max-width:calc(100% - 32px);box-shadow:0 6px 24px rgba(0,0,0,.25)}}</style>
<script>
window.G11_APP_VERSION = {json.dumps(VERSION)};
(function(){{
  if(!('serviceWorker' in navigator)) return;
  var bar=document.getElementById('upd'), refreshing=false;
  function offer(w){{ bar.hidden=false; document.getElementById('updGo').onclick=function(){{ w.postMessage('SKIP_WAITING'); }}; }}
  navigator.serviceWorker.addEventListener('controllerchange',function(){{ if(refreshing) return; refreshing=true; location.reload(); }});
  window.addEventListener('load',function(){{
    navigator.serviceWorker.register('sw.js').then(function(reg){{
      if(reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
      reg.addEventListener('updatefound',function(){{ var w=reg.installing; w.addEventListener('statechange',function(){{ if(w.state==='installed' && navigator.serviceWorker.controller) offer(w); }}); }});
      setInterval(function(){{ reg.update(); }}, 60*60*1000);
      document.addEventListener('visibilitychange',function(){{ if(document.visibilityState==='visible') reg.update(); }});
    }}).catch(function(){{}});
  }});
}})();
</script>
</body>
</html>
'''

html = pwa_head + head_part + '\n</head>\n<body>\n' + body_part + scripts + pwa_tail
# show the installed version on the Data & settings page
html = html.replace('<p class="muted">Content: ${G.LESSONS.length} lessons',
                    '<p class="muted">App version ${window.G11_APP_VERSION||"web"} · Content: ${G.LESSONS.length} lessons', 1)
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(html)

manifest = {
  "name": "G11 Exam Prep", "short_name": "G11 Prep",
  "description": "Independent ICC G11 General Building Contractor (A) exam preparation.",
  "start_url": "./#home", "scope": "./", "display": "standalone", "orientation": "any",
  "background_color": "#14203a", "theme_color": "#14203a",
  "icons": [
    {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
    {"src": "icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
  ]
}
open(os.path.join(OUT, 'manifest.webmanifest'), 'w').write(json.dumps(manifest, indent=2))

sw = f'''/* G11 Exam Prep service worker. Version changes on every build so phones update. */
const VERSION = {json.dumps(VERSION)};
const CACHE = 'g11prep-' + VERSION;
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png', './lib/pdfjs/pdf.min.mjs', './lib/pdfjs/pdf.worker.min.mjs'];
self.addEventListener('install', e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); }});
self.addEventListener('activate', e => {{
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('g11prep-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
}});
self.addEventListener('message', e => {{ if (e.data === 'SKIP_WAITING') self.skipWaiting(); }});
self.addEventListener('fetch', e => {{
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {{
    // Network first so updates arrive; cached copy when offline.
    e.respondWith(fetch(req).then(r => {{ const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; }})
      .catch(() => caches.match('./index.html')));
    return;
  }}
  if (url.origin === location.origin) {{
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {{ const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; }})));
    return;
  }}
  if (/fonts\\.(googleapis|gstatic)\\.com$/.test(url.hostname)) {{
    // Fonts: serve cached, refresh in the background.
    e.respondWith(caches.open('g11prep-fonts').then(c => c.match(req).then(hit => {{
      const net = fetch(req).then(r => {{ c.put(req, r.clone()); return r; }}).catch(() => hit);
      return hit || net;
    }})));
  }}
}});
'''
open(os.path.join(OUT, 'sw.js'), 'w').write(sw)
print('Built version', VERSION, 'index.html', len(html), 'bytes')
