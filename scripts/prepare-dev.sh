#!/bin/bash

ERROR() {
  echo -e '\033[1;31m'$*'\033[0m'
}

SUCCESS() {
  echo -e '\033[1;35m'$*'\033[0m'
}

cleanUp() {
  if output=$(psql -U zero -w -d postgres -c "DROP DATABASE $PGDATABASE" 2>&1); then
    SUCCESS "\nDatabase droped"
  else
    ERROR $output
  fi
}

trap cleanUp EXIT


if output=$(psql -U zero -w -d postgres -c "CREATE DATABASE $PGDATABASE" 2>&1); then
  SUCCESS "Database created."
else
  ERROR $output'\n'
  exit 1
fi

if output=$(psql -U zero -w -f ./scripts/migrations/$PGDATABASE.sql 2>&1); then
  SUCCESS "Migrations runned."
else
  ERROR $output'\n'
  exit 1
fi
