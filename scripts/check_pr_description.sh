#!/bin/bash

description=$1

if ! echo "$description" | grep -q '## Summary' || ! echo "$description" | grep -q '## Testing done'; then
  echo "PR description is missing required sections"
  exit 1
elif ! echo "$description" | grep -q '.\{5,\}' <<< "$(echo "$description" | grep '## Summary' -A 1 | tail -n +2)" || \
     ! echo "$description" | grep -q '.\{5,\}' <<< "$(echo "$description" | grep '## Testing done' -A 1 | tail -n +2)"; then
  echo "One or both sections have less than 5 characters"
  exit 1
fi
