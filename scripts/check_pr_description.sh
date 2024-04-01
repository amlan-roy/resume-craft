#!/bin/bash

description="$1"

if ! echo "$description" | grep -q '## Summary'; then
  echo "PR description is missing summary section"
  exit 1
elif ! echo "$description" | grep -q '## Testing done'; then
  echo "PR description is missing testing done section"
  exit 1
elif ! echo "$description" | awk '/## Summary/{flag=1;next}/##/||/#/{flag=0}END{flag=0}flag' | awk 'length($0) < 5 && NR > 1'; then
  echo "Summary section has less than 5 characters"
  exit 1
elif ! echo "$description" | awk '/## Testing done/{flag=1;next}/##/||/#/{flag=0}END{flag=0}flag' | awk 'length($0) < 5 && NR > 1'; then
  echo "Testing section has less than 5 characters"
  exit 1
fi
