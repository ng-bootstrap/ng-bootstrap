#!/bin/bash

set -e

if [ "$1" == "--destroy-existing" ] ; then
  echo "Destroying existing VM"
  vagrant destroy -f
fi

vagrant up
vagrant provision --provision-with start-assistive-playwright,start-nvda
VBoxManage controlvm win10-apw setvideomodehint 1280 720 32
vagrant snapshot save nvda
vagrant halt -f
