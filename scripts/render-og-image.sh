#!/usr/bin/env bash
# Re-render public/og-image.jpg (1200×630) from design/og-image/card.html.
# Needs: a prior `npm run build` (for the Inter / Instrument Sans files), Google Chrome, python3 + Pillow.
set -euo pipefail
cd "$(dirname "$0")/.."
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

cp design/og-image/card.html design/og-image/wordmark.png "$work/"
cp public/hero-showreel-poster.jpg "$work/poster.jpg"
css="$(ls .next/static/chunks/*.css | head -1)"
font_for() { grep -oE "font-family:$1;[^}]*src:url\(\.\./media/[^)]+-s\.p\.[^)]+\.woff2\)" "$css" | grep -oE "[^/]+-s\.p\.[^)]+\.woff2" | head -1; }
cp ".next/static/media/$(font_for Inter)" "$work/inter.woff2"
cp ".next/static/media/$(font_for 'Instrument Sans')" "$work/instrument.woff2"

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=4000 \
  --allow-file-access-from-files --user-data-dir="$work/profile" \
  --screenshot="$work/card.png" "file://$work/card.html" >/dev/null 2>&1

python3 -c "from PIL import Image; Image.open('$work/card.png').convert('RGB').save('public/og-image.jpg', quality=88, optimize=True, progressive=True)"
echo "Wrote public/og-image.jpg"
