#!/bin/bash

rm -rf node_modules
yarn set version berry
yarn plugin import @yarnpkg/plugin-workspace-tools
yarn config set checksumBehavior ignore
yarn install --immutable > /dev/null

yarn workspace @upsetjs/react run build-storybook
yarn workspace @upsetjs/app run build

mkdir -p dist/api
cp -r packages/app/dist/* dist/
cp -r packages/react/storybook-static/* dist/api/
