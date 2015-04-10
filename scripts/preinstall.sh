#!/usr/bin/env bash

if [ $(which osmfilter) ] && [ $(which osmconvert) ]; then
    exit
fi

echo
echo "ERROR: Missing dependencies need to be installed."
echo "Please install osmfilter and osmconvert as follows:"
echo
echo "osmfilter  [see http://wiki.openstreetmap.org/wiki/Osmfilter]"
echo "  wget -O - http://m.m.i24.cc/osmfilter.c |cc -x c - -O3 -o /usr/local/bin/osmfilter"
echo
echo "osmconvert  [see http://wiki.openstreetmap.org/wiki/Osmconvert]"
echo "  wget -O - http://m.m.i24.cc/osmconvert.c | cc -x c - -lz -O3 -o /usr/local/bin/osmconvert"

exit 1