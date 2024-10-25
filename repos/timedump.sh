#!/bin/bash

# Check if keychain_dumper (the program that dumps the keychain) is installed
if [ ! -f "/usr/bin/keychain_dumper" ]; then
    echo -e "\e[38;5;196m[ERR] Please install keychain_dumper."
    exit 1
fi

clear

# Set the background and text color
echo -e "\e[38;5;39m"

echo "[INFO] Please authenticate on your device."
KEYCHAIN=$(keychain_dumper > /dev/null 2>&1)

echo "[INFO] Finding Screen Time passcode..."
CODE=$(grep -A9 -a "ParentalControls" $KEYCHAIN | tail -n1 | grep -o '[0-9]\+')

echo "[INFO] Code found: \e[38;5;10m$CODE"
