#!/bin/bash
set -e

rm -rf node_modules
yarn set version berry
yarn plugin import @yarnpkg/plugin-workspace-tools
yarn config set checksumBehavior ignore

echo "yarn install"
yarn install --immutable

echo "build things"
yarn workspace @upsetjs/react run build-storybook
yarn workspace @upsetjs/app run build

echo "copy things"
mkdir -p dist/api
cp -r packages/app/dist/* dist/
cp -r packages/react/storybook-static/* dist/api/
