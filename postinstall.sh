#!/usr/bin/env bash

blue='\033[0;34m'
green='\033[0;32m'
NC='\033[0m' # No Color

echo
echo "${blue}Install osmfilter${NC}"
wget -O - http://m.m.i24.cc/osmfilter.c |cc -x c - -O3 -o ./node_modules/.bin/osmfilter

echo
echo "${blue}Install osmconvert${NC}"
wget -O - http://m.m.i24.cc/osmconvert.c | cc -x c - -lz -O3 -o ./node_modules/.bin/osmconvert