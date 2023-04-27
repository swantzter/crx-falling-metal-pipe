#!/usr/bin/env bash

mkdir -p dist

# Chrome/Edge
rm -f dist/chromium.zip
pushd chromium
zip -r ../dist/chromium.zip *
popd
pushd shared
zip -r ../dist/chromium.zip *
popd

# Also provide uncompressed version to be able to test it locally
rm -rf dist/chromium
mkdir -p dist/chromium
cp -r chromium/* dist/chromium/
cp -r shared/* dist/chromium/

# Firefox
rm -f dist/firefox.zip
pushd firefox
zip -r ../dist/firefox.zip *
popd
pushd shared
zip -r ../dist/firefox.zip *
popd
