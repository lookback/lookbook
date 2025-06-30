#!/usr/bin/env bash
set -euo pipefail

# USAGE
# ./scripts/list-missing-vars.sh
# 
# Will print all missing variables and usage locations to stdout and exit with code 1. If no vars are missing, nothing
# is printed and exit code is 0.

# Temporary file to store warnings
warnings_file=$(mktemp)

# Declare an array to hold defined variables
defined_vars=()

is_defined() {
    local var
    for var in "${defined_vars[@]}"; do
        if [[ "$var" == "$1" ]]; then
            return 0
        fi
    done
    return 1
}

# 1. Get generated variables using npm run vars.
# Expected output lines like:
#   --my-var: the-value;
project_root="$(cd "$(dirname "$0")"/.. && pwd)"
npm_vars_output=$(npm run --silent --prefix "$project_root" vars 2>/dev/null || true)

if [[ -n "$npm_vars_output" ]]; then
  while IFS= read -r line; do
    if [[ $line =~ ^/\*! ]]; then continue; fi
    # Extract variable names that start with -- and end at the first colon.
    if [[ $line =~ ^(--[A-Za-z0-9_-]+): ]]; then
      if [ ${#BASH_REMATCH[@]} -gt 1 ]; then
        varname="${BASH_REMATCH[1]}"
        defined_vars+=("$varname")
      fi
    fi
  done <<< "$npm_vars_output"
fi

# 2. Also scan files under src/ for CSS variable definitions.
# This grep looks for tokens like "--variable:".
while IFS= read -r match; do
  if [[ $match =~ (--[A-Za-z0-9_-]+) ]]; then
    if [ ${#BASH_REMATCH[@]} -gt 1 ]; then
      varname="${BASH_REMATCH[1]}"
      defined_vars+=("$varname")
    fi
  fi
done < <(grep -Rh --exclude-dir=node_modules -oE '(--[A-Za-z0-9_-]+)[[:space:]]*:' src/ || true)

# 3. Search for CSS variable usages: var(--some-var)
# We'll grep for the pattern and then check whether the extracted variable is defined.
# Note: Using grep with -n gives file:line:content.
grep -R -n --exclude-dir=node_modules -E 'var\(\s*(--[A-Za-z0-9_-]+)\s*\)' src/ 2>/dev/null | while IFS=: read -r file line rest; do
  content="$rest"
  # Extract all variable usages from the content.
  matches=$(echo "$content" | grep -oE 'var\(\s*(--[A-Za-z0-9_-]+)\s*\)')
  for match in $matches; do
    used_var=$(echo "$match" | sed -E 's/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/\1/')
    # Check if this variable is in our defined_vars list.
    if ! is_defined "$used_var"; then
      echo -e "$used_var -> $file:$line" >> "$warnings_file"
    fi
  done
done

# If the warnings file is non-empty, print warnings and exit non-zero; otherwise, confirm all is good.
if [ -s "$warnings_file" ]; then
  cat "$warnings_file"
  rm "$warnings_file"
  exit 1
else
  rm "$warnings_file"
fi
