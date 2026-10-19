from pathlib import Path
import shutil
import hashlib
import re

ROOT = Path(__file__).resolve().parent
FILES = (
    'index.html', 'style1.css', 'script1.js', 'transit-data.js',
    'schedule-data.js', 'campus-places.js', 'search-scope.js',
    'journey-engine.js', 'live-buses.js', 'navigation.js', 'map-config.js',
    'i18n-es.js', 'campus-extras.js', 'live-arrivals.js',
)

for name in FILES:
    if not (ROOT / name).is_file():
        raise SystemExit('Missing application source: ' + name)
destination = ROOT / 'dist'
if destination.exists():
    shutil.rmtree(destination)
destination.mkdir()
for name in FILES:
    shutil.copy2(ROOT / name, destination / name)
version=hashlib.sha256(b''.join((ROOT/name).read_bytes() for name in FILES)).hexdigest()[:12]
index=destination/'index.html'
html=index.read_text()
html=re.sub(r'(src|href)="([a-zA-Z0-9_-]+\.(?:js|css))"', lambda m: m[1]+'="'+m[2]+'?v='+version+'"',html)
index.write_text(html)
print('Built public application assets. No API key is used in this edition.')
