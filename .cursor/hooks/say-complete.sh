#!/bin/bash

# Read and discard hook payload from stdin.
cat >/dev/null

if command -v say >/dev/null 2>&1; then
  say "已完成" >/dev/null 2>&1 &
fi

printf '{}\n'
