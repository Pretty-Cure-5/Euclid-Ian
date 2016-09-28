#!/usr/bin/env bash
# System-wide update script for Ubuntu/NeCTAR.
# (This just needs to be called by a web-based request; unimplemented because it needs admin.)

################################################################################
# Configuration                                                                #
################################################################################
home=/home/ubuntu
repo="$home"/Euclidian
sage="$home"/sage2
apps="$sage"/public/uploads/apps/
sync="$repo"/Server

################################################################################
# http://thewebsiteisdown.com/                                                 #
################################################################################
killall node

################################################################################
# Update Apps                                                                  #
################################################################################
cd "$repo"
git pull --all
cp -r "$repo"/SAGE2/* "$apps"

################################################################################
# Update Server                                                                #
################################################################################
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get autoremove
sudo apt-get autoclean

################################################################################
# Update Node                                                                  #
################################################################################
cd "$sage"
npm run in

################################################################################
# The website is up.com                                                        #
################################################################################
cd "$sage"
nohup node server.js -li &
cd "$sync"
nohup node sys.js -li &

