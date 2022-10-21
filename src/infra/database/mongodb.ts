import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri);

const state: {connection:null|MongoClient} = {
  connection: null
}

export function initMongoDB(cb:() => void) {
  client.connect().then((connection) => {
    console.log('Mongo Database connected successfully.');
    if (state.connection)
      cb();
    else {
      state.connection = connection;
      cb();
    }
  })
}

export const db = (dbName:string) => state.connection.db(dbName)
