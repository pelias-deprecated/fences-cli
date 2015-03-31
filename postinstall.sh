#!/usr/bin/env bash

blue='\033[0;34m'
green='\033[0;32m'
NC='\033[0m' # No Color

if [ $(which osmfilter) ] && [ $(which osmconvert) ]; then
  echo
  echo "${blue}Linking previously installed osmfilter and osmconvert${NC}"

  ln -svf $(which osmconvert) ./node_modules/.bin/osmconvert
  ln -svf $(which osmfilter) ./node_modules/.bin/osmfilter
else
  echo
  echo "${blue}Install osmfilter${NC}"
  wget -O - http://m.m.i24.cc/osmfilter.c |cc -x c - -O3 -o ./node_modules/.bin/osmfilter

  echo
  echo "${blue}Install osmconvert${NC}"
  wget -O - http://m.m.i24.cc/osmconvert.c | cc -x c - -lz -O3 -o ./node_modules/.bin/osmconvert
fi
