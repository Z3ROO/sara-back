export NODE_ENV=dev
export SERVER_PORT=3001
export PGUSER="postgres"
export PGHOST="localhost"
export PGDATABASE="sandbox"
export PGPASSWORD="193746"
export PGPORT=5432
node scripts/__config/init.js up && {
  nodemon src/infra/http-server/index.ts 
}
node scripts/__config/init.js down
