#!/bin/sh

set -eo pipefail

postcss src/lookbook.css --no-map --dir dist --verbose $*
