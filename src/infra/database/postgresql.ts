
import { Client, Pool, PoolClient } from 'pg';
import { DatabaseError, RepositoryError } from '../../util/errors/RepositoryError';

const pool = new Pool();

export function dbCheck(callback: (()=> void)) {
  const client = new Client();
  client.connect(err => {
    if (err) {
      console.log('Database error: ', err);
    }
    else {
      console.log('Database connected');
      client.end();
      callback();
    }
  });
}

export function queryDatabase(query: string, parameters?: any[]) {
  return pool.query(query, parameters);
}

export async function handleTransaction(callback: ((client: PoolClient) => Promise<void>)) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN');
    await callback(client);
    await client.query('COMMIT');
  }
  catch(err) {
    await client.query('ROLLBACK');
    
    if (err.name === 'RepositoryError')
      throw err;

    throw new DatabaseError(err.message);
  }
  finally {
    client.release();
  }
}


// (async () => {
//   queryTransaction(async (queryDatabase) => {
//     const mainQuestLine = await queryDatabase(`SELECT * FROM questlines WHERE type = 'main'`);
//     if (mainQuestLine.rowCount >= 1)
//       throw new Error('Repo error')
    
//     await queryDatabase(`INSERT INTO questline (title, description, type, icon) VALUES ($1, $2, $3, $4)`);
//   })
// })();