#!/bin/bash

# Path to the centralized .env file
CENTRAL_ENV_FILE=".env"

# List of target directories
TARGET_DIRS=(
  "./chmr-dmz-dal"
  "./chmr-intake-web"
  "./chmr-dmz-maint"
)

# Copy the .env file to each target directory
for dir in "${TARGET_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    cp "$CENTRAL_ENV_FILE" "$dir/.env"
    echo "Copied .env to $dir"
  else
    echo "Directory $dir does not exist. Skipping..."
  fi
done