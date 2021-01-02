#!/usr/bin/env bash
set -eo pipefail

source "$(dirname "$0")/config.sh"

all=lookbook.css
base=base.css
utils=utils.css

ext=css
ext_min_maps=dist.css
ext_min=min.css

help() {
  echo "$(cat << 'EOM'
sizes.sh [--html | --json | --help]

Will print the file sizes of the distributable .css files
to stdout. Can be formatted as HTML or JSON with the
--html and --json options.

Example:

  sizes.sh --json > sizes.json
EOM
)"
}

size_of() {
  local file_path=$1
  # NR==1 is for the first row from `du`
  du -sch $file_path | awk -F " " NR==1{'print $1'}
}

table_size() {
  local file_path=$1
  local size="$(size_of $file_path)"

  printf "<tr><td>%s</td><td>%s</td>\n" "$file_path" "$size"
}

json_size() {
  local file_path=$1
  local size="$(size_of $file_path)"

  printf '"%s": %d,' "$file_path" "$(echo $size | sed 's/K//')"
}


write_html_sizes() {
  # local OUT="<!doctype html><html><head><title>Lookbook sizes</title></head><body><table>"
  local OUT=$(cat <<'EOM'
<!doctype html>
<html>
  <head>
    <title>Lookbook sizes</title>
    <style>
      body { font: normal 1em/1.5 monospace; }
      th { text-align: left; }
    </style>
  </head>
  <body>
    <table>
      <tr>
        <th>File</th>
        <th>Size</th>
      </tr>
EOM
)

  for f in "$@"; do
    local file=`basename $f .css`

    OUT+="$(table_size $LOOKBOOK_DIR/$file.$ext)"
    OUT+="$(table_size $LOOKBOOK_DIR/$file.$ext_min)"
    OUT+="$(table_size $LOOKBOOK_DIR/$file.$ext_min_maps)"
  done

  OUT+="</table></body></html>"

  echo "$OUT"
}

write_json_sizes() {
  local OUT=""

  for f in "$@"; do
    local file=`basename $f .css`

    OUT+="$(json_size $LOOKBOOK_DIR/$file.$ext)"
    OUT+="$(json_size $LOOKBOOK_DIR/$file.$ext_min)"
    OUT+="$(json_size $LOOKBOOK_DIR/$file.$ext_min_maps)"
  done

  echo "{$OUT}" | sed 's/\(.*\),/\1/' # Remove last comma occurrence
}

print_sizes () {
  for f in "$@"; do
    local file=`basename $f .css`

    local size_nonminified="$(size_of $LOOKBOOK_DIR/$file.$ext)"
    printf "%s\t\t%s\n" "$LOOKBOOK_DIR/$file.$ext" "$size_nonminified"

    local size_nonmap="$(size_of $LOOKBOOK_DIR/$file.$ext_min)"
    printf "%s\t\t%s\n" "$LOOKBOOK_DIR/$file.$ext_min" "$size_nonmap"

    local size="$(size_of $LOOKBOOK_DIR/$file.$ext_min_maps)"
    printf "%s\t\t%s\n" "$LOOKBOOK_DIR/$file.$ext_min_maps" "$size"
  done
}

if [ "$1" == "--html" ]; then
  write_html_sizes $all $base $utils
elif [ "$1" == "--json" ]; then
  write_json_sizes $all $base $utils
elif [ "$1" == "--help" ]; then
  help
else
  print_sizes $all $base $utils
fi
