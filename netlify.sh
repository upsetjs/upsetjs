#!/bin/bash
yarn set version berry
yarn plugin import @yarnpkg/plugin-workspace-tools
yarn unplug @storybook/core
yarn
yarn run website