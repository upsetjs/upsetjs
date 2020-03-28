#!/bin/bash
set -e

rm -rf node_modules
rm -rf .yarnrc.yml
rm -rf .yarn

yarn set version berry
yarn plugin import @yarnpkg/plugin-workspace-tools
yarn config set checksumBehavior ignore

echo "yarn install"
yarn install --immutable --cache-folder $NETLIFY_BUILD_BASE/.yarn_cache

echo "build things"
yarn workspace @upsetjs/react run build-storybook
yarn workspace @upsetjs/app run build

echo "copy things"
mkdir -p dist/api
cp -r packages/app/dist/* dist/
cp -r packages/react/storybook-static/* dist/api/
