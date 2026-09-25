#!/usr/bin/env python3
"""Add a tiny base64 thumbnail ("preview_data_uri") to the sample posts.

Chat preview panes (claude.ai, ChatGPT canvas) block outside images, so
preview.html shows this data: URI as a stand-in behind the real
<img>. In a real browser the cdn_url image loads on top. The field is for
the preview only - the live API never returns it.

Only the first image entry of the first POSTS posts in each sample file gets
one (that is all preview.html uses). Re-run after changing a sample image:
  python3 tools/add-preview-thumbs.py        (macOS - uses sips)
"""
import base64
import json
import re
import subprocess
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ["guides/sample-posts-social.json", "guides/sample-posts-reviews.json"]
POSTS = 6
WIDTH = 200     # px - sharp enough for a card, still ~10 KB so it loads at once
QUALITY = 60    # JPEG quality


def strip_app1(jpeg):
    """Drop Exif (APP1) segments - dead weight in a small thumbnail."""
    out, i = bytearray(jpeg[:2]), 2
    while i < len(jpeg) and jpeg[i] == 0xFF and jpeg[i + 1] not in (0xDA, 0xD9):
        size = int.from_bytes(jpeg[i + 2:i + 4], "big")
        if jpeg[i + 1] != 0xE1:
            out += jpeg[i:i + 2 + size]
        i += 2 + size
    return bytes(out + jpeg[i:])


def thumb(url):
    with tempfile.TemporaryDirectory() as tmp:
        src, dst = Path(tmp, "src"), Path(tmp, "dst.jpg")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        src.write_bytes(urllib.request.urlopen(req, timeout=30).read())
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", str(QUALITY),
                        "--resampleWidth", str(WIDTH), "--deleteColorManagementProperties",
                        str(src), "--out", str(dst)], check=True, capture_output=True)
        data = strip_app1(dst.read_bytes())
    return "data:image/jpeg;base64," + base64.b64encode(data).decode()


def main():
    for rel in FILES:
        path = ROOT / rel
        # Clear old thumbnails first so a re-run never leaves stale ones.
        text = re.sub(r', "preview_data_uri": "[^"]*"', "", path.read_text())
        for post in json.loads(text)[:POSTS]:
            image = next((m for m in post.get("media") or [] if m.get("type") == "image"), None)
            if not image:
                continue
            url = image["cdn_url"]
            uri = thumb(url)
            # Edit the text in place to keep the file's hand-made layout.
            text = text.replace(f'"cdn_url": "{url}"', f'"cdn_url": "{url}", "preview_data_uri": "{uri}"', 1)
            print(f"{rel} {post['id']}: {len(uri)} chars")
        json.loads(text)  # still valid JSON
        path.write_text(text)


if __name__ == "__main__":
    main()
