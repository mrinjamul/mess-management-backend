#!/bin/bash

source ./tools/variable.sh

set -e  # if a command fails it stops the execution
set -u  # script fails if trying to access to an undefined variable

echo "Building $IMAGE"
echo docker build . -t $IMAGE:$TAG
docker build . -t $IMAGE:$TAG

# If the function returned err, exit
if [ $? -ne 0 ]; then
  echo "$IMAGE build failed!"
  exit 1
fi

# print success
echo "$IMAGE built successfully!"

