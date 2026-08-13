#!/bin/bash

# Fail the step if the tag cannot be created or pushed. Without this, a rejected
# `git push` still exits 0 and the release step goes on to use a tag that was
# never created.
set -eo pipefail

git fetch --tags --force

# Highest released version, chosen by version order rather than by "whichever tag
# git describe finds on the newest tagged commit".
latest_tag=$(git tag -l '[0-9]*.[0-9]*.[0-9]*' | sort -V | tail -1)

if [[ -z $latest_tag ]]; then
  echo "No version tag found; refusing to guess the next version" >&2
  exit 1
fi

# Split the latest tag into an array
IFS='.' read -r -a version_parts <<< "$latest_tag"

# Bump the patch version
new_tag="${version_parts[0]}.${version_parts[1]}.$((version_parts[2] + 1))"

# Create and push the new tag
git tag "$new_tag"
git push origin "$new_tag"
echo "new_tag=$new_tag"

echo "new_tag=$new_tag" >> "$GITHUB_OUTPUT"
echo "NEW_TAG=$new_tag" >> "$GITHUB_ENV"
