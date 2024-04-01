#!/bin/bash

description="$1"

if ! echo "$description" | grep -q '## Summary'; then
  echo "PR description is missing summary section"
  exit 1
elif ! echo "$description" | grep -q '## Testing done'; then
  echo "PR description is missing testing done section"
  exit 1
fi
