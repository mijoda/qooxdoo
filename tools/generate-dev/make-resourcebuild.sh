#!/usr/bin/env bash

echo
echo "  GENERATING RESOURCE BUILD:"
echo "----------------------------------------------------------------------------"
echo "  * Syncing resource files..."

mkdir -p build/images build/themes
rsync -rl --exclude=.svn --exclude=*.js source/resources build/
