const {exec} = require('child_process');

const action = process.argv[2]

function createDatabase() {
  console.log('Creating database...')
  exec(`psql -U postgres -w -d postgres -c "CREATE DATABASE ${process.env.PGDATABASE}"`, (err, stdout, stderr) => {
    if (stderr) {
      console.log(stderr)
      throw new Error('Erro ao executar createDatabase()');
    }

    console.log('Database created.')
    execMigrations()
  });
}

function execMigrations() {
  console.log('Running migrations...')
  exec(`psql -U postgres -w -f ./scripts/migrations/${process.env.PGDATABASE}.sql`, (err, stdout, stderr) => {
    if (stderr) {
      console.log(stderr);
      throw new Error('Erro ao executar execMigrations()');
    }
    console.log('Migrations ok')
  });
}

function dropDatabase() {
  exec(`psql -U postgres -w -d postgres -c "DROP DATABASE ${process.env.PGDATABASE}"`, (err, stdout, stderr) => {
    if (stderr) {
      console.log(stderr);
      throw new Error('Erro ao executar dropDatabase()');
    }

    console.log('Database droped')
  });
}

if (action === 'up')
  createDatabase();

if (action === 'down')
  dropDatabase();