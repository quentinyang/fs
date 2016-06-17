#!/bin/bash
currentPath=`pwd`
repository=$1
branchName=$2
deployment=$3
destDir=$4

ufaDebug=$5
ufaMode="-p"
if $ufaDebug; then
  ufaMode="--dev"
fi

ufaOriginDir=$6
ufaDestDir=$7
ufaRule=$8

# update repository
./shell/update_repository.sh $1 $2 $3 $4

# build

gitName=${repository##*/}
baseGitName=${gitName%.git}
branchDirectory="$destDir/$branchName/$deployment/$baseGitName"

cd $branchDirectory
ufaCommand="./node_modules/gulp-ufa/bin/ufa $ufaOriginDir $ufaMode --dir $ufaDestDir -r $ufaRule"

echo "Execute: $ufaCommand"
# gulp-ufa ./ -p --dir public/dist -r app-crm
$ufaCommand

# TODO::Store
cd $currentPath
node ./bin/deploy $ufaRule $deployment



