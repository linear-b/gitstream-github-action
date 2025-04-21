#!/bin/bash

git fetch --tags

# Get the latest tag
latest_tag=$(git describe --tags `git rev-list --tags --max-count=1`)

# Check if the latest tag starts with 'v' and remove it
if [[ $latest_tag == v* ]]; then
  latest_tag=${latest_tag:1}
fi

# Split the latest tag into an array
IFS='.' read -r -a version_parts <<< "$latest_tag"

# Bump the patch version
new_tag="${version_parts[0]}.${version_parts[1]}.$((version_parts[2] + 1))"

# Create and push the new tag
git tag $new_tag
git push origin $new_tag
echo "new_tag=$new_tag"

echo "new_tag=$new_tag" >> $GITHUB_OUTPUT
echo "NEW_TAG=$new_tag" >> $GITHUB_ENV