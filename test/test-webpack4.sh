#!/usr/bin/env bash

set -e

# cleanup on exit
trap 'rm -fr tmp' exit

# cd in to the directory of this script
cd "$(dirname $0)"

# clean
rm -fr tmp

# install webpack 4
npm i -s --no-package-lock --prefix ./ webpack@4

# build
output="$(node_modules/.bin/webpack --config webpack4.config.ts)"

expected() {
  echo "[FAILED] expected $1"
  exit 1
}

does_contain_deprecation=$(echo "$output" | grep -i "DeprecationWarning" || echo '')

if [[ ! -f 'tmp/app.js' ]]; then
  expected "app.js to exist on output folder"
elif [[ -f 'tmp/chunk.js' ]]; then
  expected "chunk.js to not exist on output folder"
elif [[ "$does_contain_deprecation" ]]; then
  expected "output to not contain deprecation warnings"
fi

echo "[WEBPACK4 TEST OK]"
exit 0
