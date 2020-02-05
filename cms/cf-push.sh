#!/usr/bin/env bash

. ./cf-login.sh

cf-login

echo "Deploy App to SAP Cloud"
eval cf push