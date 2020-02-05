#!/usr/bin/env bash

. ~/.bash_profile

command -v brew >/dev/null 2>&1 || { echo >&2 "Installing Homebrew Now"; \
echo  "$(tput setaf 1)https://brew.sh/index_de";\exit 0;}

command -v cf >/dev/null 2>&1 || { echo >&2 "Installing Cloud Foundry CLI Now"; \
echo  "$(tput setaf 1)https://docs.cloudfoundry.org/cf-cli/install-go-cli.html";\
brew install cf-cli;\exit 0; }

file="cf.conf"
if [ -f "$file" ]
then
	echo "$(tput setaf 5)$file found."
	source $file
else
	echo "$file not found."
fi
while getopts u:p:o:s:a: option
do
case "${option}"
in
u) USER=${OPTARG};;
p) PASS=${OPTARG};;
o) ORG=${OPTARG};;
s) SPACE=$OPTARG;;
a) API=$OPTARG;;
esac
done
function help() {
  echo "Usage: `basename $0` -u //Username"
  echo "Usage: `basename $0` -p //Password"
  echo "Usage: `basename $0` -o //Organisation -- SAP Account_Subaccount"
  echo "Usage: `basename $0` -s //SAP Cloud Foundry Space"
  echo "Usage: `basename $0` -a //SAP Cloud Foundry API Url"
}

if [ "$USER" == "" ]| [ "$PASS" == "" ] | [ "$ORG" == "" ] | [ "$SPACE" == "" ] | [ "$API" == "" ]; then
	echo "$(tput setaf 1)config not set"
	echo "$(tput setaf 6)"
	help
	echo "or"
	echo "edit cf.conf"
	exit 0
fi
if [ "$1" == "-h" ]; then
  help
  exit 0
fi


echo "$(tput setaf 5)Set API Endpoint $API"
eval cf api $API

echo -e "$(tput setaf 5)Login to Sap Cloud Foundry \r\n $(tput setaf 6)\t Organisation: \t $ORG,\r\n \tSpace: \t $SPACE,\r\n \t Username: \t $USER,\r\n \t Password: \t $PASS"
cf login -o $ORG -u $USER -p $PASS -s $SPACE
