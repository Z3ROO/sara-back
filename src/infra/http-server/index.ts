import express from 'express';
import routes from '../../api-http-presenter';
import { connection, initMongoDB } from '../database/mongodb';
import { dbCheck } from '../database/postgresql';

export const app = applyRoutes(express(), routes);

export const initServer = () => dbCheck(() => {
  app.listen(
    process.env.SERVER_PORT, () => {
      console.log("Servidor conectado à porta "+process.env.SERVER_PORT)
    }
  )
});


function applyRoutes(app: any, routess: any[]) {
  routess.forEach((route) => {
    let { method, path, handler } = route;
    if (!Array.isArray(handler))
      handler = [handler];

    if (method === 'middleware') {
      if (path)
        app.use(path, ...handler)
      else
        app.use(...handler)
      
      return
    }

    app[method](path, ...handler);
  })

  return app
}

initMongoDB(initServer);

export const db = (dbname:string) => connection().db(dbname);
