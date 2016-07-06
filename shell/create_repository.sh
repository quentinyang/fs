#!/bin/bash
repository=$1
branchName=$2
deployment=$3
destDir=$4

branchDirectory="$destDir/$branchName/$deployment"

mkdir -p $branchDirectory
cd $branchDirectory
git clone -b $branchName $repository

# install npm
gitName=${repository##*/}
baseGitName=${gitName%.git}

cd $baseGitName

echo "Start npm install"
npm install
echo "End npm install"
