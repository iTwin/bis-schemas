#!/bin/bash
REPO_SOURCE_PATH=$1
REPO_TARGET_PATH=$2
IMAGE_NAME=$3
SAT=$4
PR_TITLE=$5
PR_DESC=$6
REPO_PATH=$7
PR_REVIEWERS=$8
DOCKERFILE=$9

DATE=`date +%Y-%m-%d`
PR_SOURCE_NAME="bim0200dev_merge_$DATE"

## Set the TFS variable for the new branch
## Not needed anymore but may be needed in the future
# echo "Setting PRSource to $PR_SOURCE_NAME"
# echo "##vso[task.setvariable variable=PRSource]$PR_SOURCE_NAME"

# Get the container ID
CONTAINER_ID=$(echo $(docker ps --no-trunc -aqf "ancestor=$IMAGE_NAME") | awk '{print $1}')

# Echo path for debugging
echo "Container ID:"
echo "$CONTAINER_ID:$REPO_SOURCE_PATH"

# Copy repo out of docker container
docker cp "$CONTAINER_ID:$REPO_SOURCE_PATH" $REPO_TARGET_PATH

cd $REPO_TARGET_PATH

# Get the git diff and echo it
DIFF_STRING=`git diff master $PR_SOURCE_NAME`
echo "Git diff of new branch from master:"
echo $DIFF_STRING


# If the diff string is empty, there's no need to do the merge
# If the diff string is not empty, kick off the docker image build
if [ -z "$DIFF_STRING" ]; then
  echo "No need to generate pull request"
else
  echo "Need to generate pull request"
  git checkout $PR_SOURCE_NAME
  git branch -a
  git -c http.extraheader="AUTHORIZATION: bearer $SAT" push -u origin $PR_SOURCE_NAME
  docker build -f $DOCKERFILE --build-arg SAT=$SAT --build-arg PR_TITLE=$PR_TITLE  --build-arg PR_SOURCE=$PR_SOURCE_NAME --build-arg PR_DESC=$PR_DESC --build-arg REPO_PATH=$REPO_PATH --build-arg PR_REVIEWERS=$PR_REVIEWERS --build-arg PR_REVIEWERS=$PR_REVIEWERS ../
fi