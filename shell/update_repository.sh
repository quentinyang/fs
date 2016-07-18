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

# To fix issue: "fatal: Unable to create 'PATH/fs/deployments/master/production/angejia/.git/index.lock': File exists."
rm -rf .git/index.lock
rm -rf .git/index
git reset HEAD .
git checkout .

git pull --rebase origin $branchName
