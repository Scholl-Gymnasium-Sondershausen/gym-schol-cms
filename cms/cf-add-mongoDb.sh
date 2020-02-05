#!/usr/bin/env bash
#Api Endpoint: https://api.cf.eu10.hana.ondemand.com
#Organisation: mobilecfbetacustomers_uniorg


. ./cf-login.sh

file="cf.conf"
fileManifest="manifest.yml"
mongoService="mongodb-service"

if [ -f "$file" ]
then
	echo "$file found."
	source $file
else
	echo "$file not found."
fi

cf-login

echo "List marketplace"
eval cf marketplace

eval cf create-service mongodb v4.0-dev $mongoService
eval cf services

if [ -f "$fileManifest" ]
then
	sed -i '' -e '$ d' $fileManifest
	sed -i '' -e '$ d' $fileManifest
	echo "  services:" >> $fileManifest
	echo "  - $mongoService" >> $fileManifest
else
	echo "$file not found."
fi