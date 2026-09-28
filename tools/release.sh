#!/bin/sh
# Point every AI-fetched link at a new git tag, commit, tag and push.
# A tag URL has never been fetched before, so no chat can answer from a
# cached copy or a remembered older version.   Usage: tools/release.sh build-2026-10-01
set -e
TAG="$1"; [ -n "$TAG" ] || { echo "usage: tools/release.sh <new-tag>"; exit 1; }
cd "$(dirname "$0")/.."
REPO=$(basename "$(git rev-parse --show-toplevel)")
git grep -lIE "raw\.githubusercontent\.com/wallapi/$REPO/" -- ':!*.zip' | while read -r f; do
  perl -pi -e "s#(raw\.githubusercontent\.com/wallapi/\Q$REPO\E/)[^/\s\"'<>)]+(?=[/\s\"'<>)]|\$)#\${1}$TAG#g" "$f"
done
git add -A
git commit -q -m "release: point build links at $TAG"
git tag "$TAG"
git push -q origin HEAD "$TAG"
echo "Released $TAG - paste prompts now use https://raw.githubusercontent.com/wallapi/$REPO/$TAG"
