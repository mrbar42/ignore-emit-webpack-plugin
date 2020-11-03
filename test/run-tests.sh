#!/usr/bin/env bash

set -e

function run() {
  if [[ ! -f package.json ]]; then
    echo "Must be run from project root"
    exit 1
  fi

  npm ci

  test_webpack "Webpack3" "webpack@3.0.0 webpack-cli@2" "webpack3.config.js" || failed=1
  test_webpack "Webpack4" "webpack@4.0.0 webpack-cli@3" "webpack4.config.js" || failed=1
  test_webpack "Webpack5" "webpack@5.0.0 webpack-cli@4" "webpack5.config.js" || failed=1
  test_webpack "WebpackLatest" "webpack@latest webpack-cli@latest" "webpack.config.js" || failed=1

  npm ci

  if [[ "$failed" ]]; then
    echo "Some tests failed!"
    exit 1
  fi
}

function test_webpack() {
  local test_id="$1"
  local packages="$2"
  local config="$3"

  echo "[$test_id] Starting test"

  # clean
  rm -fr test/tmp

  npm r --no-warnings --no-save --no-progress --no-audit --no-package-lock webpack webpack-cli || return 1
  npm i --no-warnings --no-save --no-progress --no-audit --no-package-lock ${packages} || return 1

  if [[ ! "$(node_modules/.bin/webpack -v)" ]]; then
    echo "[$test_id] Webpack executable didn't print version"
    return 1
  fi

  # build
  output="$(node_modules/.bin/webpack --config "test/$config" 2>&1)"
  echo "$output"

  does_contain_deprecation=$(echo "$output" | grep -i "Warning" || echo '')

  if [[ ! -f 'test/tmp/app.js' ]]; then
    expected "$test_id" "app.js to exist on output folder" || return 1
  elif [[ -f 'test/tmp/chunk.js' ]]; then
    expected "$test_id" "chunk.js to not exist on output folder" || return 1
  elif [[ "$does_contain_deprecation" ]]; then
    expected "$test_id" "output to not contain deprecation warnings\n\033[1;33m$output" || return 1
  fi

  echo -e "\033[0;32m [$test_id][TEST OK] \033[0m"
}

function expected() {
  echo -e "\033[0;31m [$1][FAILED] expected $2 \033[0m"
  return 1
}

run
