export NODE_ENV=dev
export SERVER_PORT=3001
export PGUSER="postgres"
export PGHOST="localhost"
export PGDATABASE="saratest"
export PGPASSWORD="193746"
export PGPORT=5432
ts-node scripts/__config/init.js up && {
  npx jest
}
ts-node scripts/__config/init.js down
