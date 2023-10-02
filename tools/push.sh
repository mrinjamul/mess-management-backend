#!/bin/bash

source ./tools/variable.sh

echo "Pushing image to DockerHub..."
if [[ "$TAG" != "latest"  ]]
then
    echo docker push $IMAGE:$TAG
    docker tag $IMAGE:$TAG $IMAGE:latest
    docker push $IMAGE:$TAG
    docker push $IMAGE:latest
else
    echo docker push $IMAGE:$TAG
    docker push $IMAGE:$TAG
fi

# If the function returned err, exit
if [ $? -ne 0 ]; then
  echo "$IMAGE push failed!"
  exit 1
fi

# print success
echo "$IMAGE pushed successfully!"

