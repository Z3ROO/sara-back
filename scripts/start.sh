#!/bin/bash

export NODE_ENV=production
export SERVER_PORT=1337
export DB_PORT=27017
export FRONTEND_URL="http://localhost"
export BACKEND_URL="http://localhost:$SERVER_PORT"

#source ./scripts/prepare-dev.sh

node dist/index.js