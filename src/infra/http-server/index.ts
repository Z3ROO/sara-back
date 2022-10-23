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

function routeHandlerWrapper(handler: (req:any, res: any) => any) {
  return (req: any, res: any) => {
    try {
      let {status, message, body} = handler(req, res);
      
      if (!status)
        status = 200
      
      if (!message)
        message = null;

      if (!body)
        body = null;
      
        
      res.status(status);

      res.json({
        status,
        message,
        body
      });
    }
    catch(err) {
      res.status(500);

      res.json({
        status: '500',
        message: 'Default message, to be fully implemented',
        body:null
      })
    }
  }
}


function applyRoutes(app: any, routess: any[]) {
  routess.forEach((route) => {
    let { method, path, handler } = route;
    if (!Array.isArray(handler))
      handler = [handler];
    
    handler = routeHandlerWrapper(handler);

    if (method === 'middleware') {
      if (path)
        app.use(path, handler)
      else
        app.use(handler)
      
      return
    }

    app[method](path, handler);
  })

  return app
}

initMongoDB(initServer);

export const db = (dbname:string) => connection().db(dbname);
