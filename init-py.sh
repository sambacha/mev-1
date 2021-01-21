#!/bin/bash
# python env
virtualenv -p python3 ~/.mev
source ~/.mev/bin/activate
pip install --upgrade pip setuptools
pip install --upgrade web3
