#!/bin/sh
# Publish main to the "build" branch. Every AI-fetched link points at
# raw.githubusercontent.com/wallapi/<repo>/build/..., so this is the only
# step that makes a change live for the build prompts.   Usage: tools/release.sh
set -e
cd "$(dirname "$0")/.."
git push -q origin HEAD:main HEAD:build
echo "Published $(git rev-parse --short HEAD) to main and build"
