#!/bin/bash

# Toggle macOS pfctl airgap
CONF_FILE="$(dirname "$0")/pf_airgap.conf"

echo "Select action:"
echo "1) Enable Airgap"
echo "2) Disable Airgap"
read -p "Choice (1/2): " choice

if [ "$choice" = "1" ]; then
    echo "Enabling Airgap... (requires sudo)"
    sudo pfctl -e -f "$CONF_FILE"
    echo "Airgap ENABLED."
elif [ "$choice" = "2" ]; then
    echo "Disabling Airgap... (requires sudo)"
    sudo pfctl -d
    echo "Airgap DISABLED."
else
    echo "Invalid choice."
fi
