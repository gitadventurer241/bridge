#!/bin/bash

# Set the Python version and replace with your desired version
PYTHON_VERSION=3.8

# Path to your main.py file
MAIN_PY_FILE="main.py"

# List of required tools
REQUIRED_TOOLS=("flake8")

# Function to check if a tool is installed
check_tool() {
    command -v "$1" >/dev/null 2>&1 || { echo >&2 "$1 is not installed. Please install it by typing pip install $1."; exit 1; }
}

# Check if Python is installed
if ! command -v python3 &>/dev/null; then
    echo "Python is not installed. Please install Python $PYTHON_VERSION or higher."
    exit 1
fi

# Check if the required tools are installed
for tool in "${REQUIRED_TOOLS[@]}"; do
    check_tool "$tool"
done

# Install Python and required dependencies
echo "Setting up Python..."
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt

# Run Flake8 (Linting Tool)
echo "Running Flake8 (Linting Tool)..."
flake8 "$MAIN_PY_FILE"

# Add any other linters or checks here

# Deactivate the virtual environment
deactivate

echo "Code quality check completed."
