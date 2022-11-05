import { MongoClient } from 'mongodb';

const port = process.env.DB_PORT

const uri = `mongodb://localhost:${port}`;

const client = new MongoClient(uri);

const state: {connection:null|MongoClient} = {
  connection: null
}

export const isObjectId = (_id: string) => new RegExp("^[0-9a-fA-F]{24}$").test(_id)


export async function initMongoDB(cb?:() => void) {
  if (state.connection)
    return cb ? cb() : undefined;
  
  const connection = await client.connect();
  console.log('Mongo Database connected successfully.');
  state.connection = connection;

  if (cb)
    cb();
}

export const closeDb = () => state.connection.close();


export const db = (dbname:string) => state.connection.db(dbname);
