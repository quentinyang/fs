#!/bin/bash
repository=$1
branchName=$2
deployment=$3
destDir=$4


# e.g.: retrx-mgt.git
gitName=${repository##*/}
# e.g.: retrx-mgt
baseGitName=${gitName%.git}

# ./deployments/feature-test/alpha/retrx-mgt
branchDirectory="$destDir/$branchName/$deployment/$baseGitName"

cd $branchDirectory
git checkout .
git pull --rebase origin $branchName
