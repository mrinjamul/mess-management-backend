#!/bin/bash

IMAGE="friendlyfly/mess-management-sys"

TAG=$(git describe --tags --abbrev=0)

# If there is no tag, or if the `git describe` command fails, set the tag to the current commit
if [[ $? -ne 0 ]]; then
  TAG="latest";
fi

export IMAGE=$IMAGE
export TAG=$TAG
