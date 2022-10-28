#!/bin/bash

export NODE_ENV=dev
export SERVER_PORT=3001
# export PGUSER="zero"
# export PGHOST="localhost"
# export PGDATABASE="sandbox"
# export PGPASSWORD="193746"
# export PGPORT=5432

#source ./scripts/prepare-dev.sh

nodemon src/index.ts