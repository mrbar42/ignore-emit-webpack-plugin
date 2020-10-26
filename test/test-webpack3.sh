#!/usr/bin/env bash

set -e

# cleanup on exit
trap 'rm -fr tmp' exit

# cd in to the directory of this script
cd "$(dirname $0)"

# clean
rm -fr tmp

test_id="webpack3"

# install webpack 3
npm i -s --no-warnings --no-progress --no-audit --no-package-lock --prefix ./ webpack@3

# build
output="$(node_modules/.bin/webpack --config webpack3.config.js 2>&1)"

expected() {
  echo -e "\033[0;31m [$test_id][FAILED] expected $1 \033[0m"
  exit 1
}

does_contain_deprecation=$(echo "$output" | grep -i "DeprecationWarning" || echo '')

if [[ ! -f 'tmp/app.js' ]]; then
  expected "app.js to exist on output folder"
elif [[ -f 'tmp/chunk.js' ]]; then
  expected "chunk.js to not exist on output folder"
elif [[ "$does_contain_deprecation" ]]; then
  expected "output to not contain deprecation warnings\n\033[1;33m$output"
fi

echo -e "\033[0;32m [$test_id][TEST OK] \033[0m"
exit 0
