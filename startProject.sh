#!/bin/bash

# Define the paths to your server directories
SERVER1_DIR="./backend"
SERVER2_DIR="./frontend"

# Colors for better log readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting project setup...${NC}"
echo -e "please make sure node version 20.10.0 is installed and is used."

# Check if the directories exist
if [ ! -d "$SERVER1_DIR" ] || [ ! -d "$SERVER2_DIR" ]; then
  echo "Error: One or both server directories don't exist"
  echo "Please make sure $SERVER1_DIR and $SERVER2_DIR exist"
  exit 1
fi

# Function to start a server
start_server() {
  local dir=$1
  local name=$2
  local color=$3
  
  echo -e "${color}Setting up $name...${NC}"
  
  # Navigate to server directory
  cd "$dir" || exit
  
  # Install dependencies if node_modules doesn't exist
  if [ ! -d "node_modules" ]; then
    echo -e "${color}Setting Node.js version to $NODE_VERSION for $name...${NC}"
    echo -e "${color}Installing dependencies for $name...${NC}"
    npm install
  fi
  
  # Start the server and redirect output to a log file
  echo -e "${color}Starting $name...${NC}"
  nvm use 20.10.0
  npm run dev > "../$name.log" 2>&1 &
  
  # Save the process ID
  echo $! > "../$name.pid"
  
  # Go back to original directory
  cd ..
}

# Start Server 1
start_server "$SERVER1_DIR" "backend" "$GREEN"

# Start Server 2
start_server "$SERVER2_DIR" "frontend" "$BLUE"

echo -e "${GREEN}Both servers are running!${NC}"
echo "Server 1 PID: $(cat backend.pid)"
echo "Server 2 PID: $(cat frontend.pid)"

# Function to display logs
show_logs() {
  # Use tail to follow both log files
  tail -f backend.log frontend.log
}

# Function to handle script termination
cleanup() {
  echo -e "\n${GREEN}Shutting down servers...${NC}"
  
  # Kill the server processes
  if [ -f "backend.pid" ]; then
    kill -15 "$(cat backend.pid)" 2>/dev/null
    rm backend.pid
  fi
  
  if [ -f "frontend.pid" ]; then
    kill -15 "$(cat frontend.pid)" 2>/dev/null
    rm frontend.pid
  fi
  
  echo -e "${GREEN}Servers stopped.${NC}"
  exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Showing logs from both servers (Ctrl+C to stop):${NC}"
show_logs