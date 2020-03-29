#!/bin/bash
set -e

rm -rf node_modules
rm -rf .yarnrc.yml
rm -rf .yarn
git checkout yarn.lock

yarn set version berry
yarn plugin import @yarnpkg/plugin-workspace-tools
yarn config set checksumBehavior ignore

echo "yarn install"
yarn install --immutable --cache-folder $NETLIFY_BUILD_BASE/.yarn_cache > /dev/null

echo "build things"
yarn build
yarn workspace @upsetjs/react run build-storybook

echo "copy things"
mkdir -p dist/api
cp -r packages/app/dist/* dist/
cp -r packages/react/storybook-static/* dist/api/
