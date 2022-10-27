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

function routeHandlerWrapper(handler: (req:any, res: any, next: any) => any) {
  return (req: any, res: any, next: any) => {
    try {
      let route = handler(req, res, next)||{};
      
      if (!route?.status)
        route.status = 200
      
      if (!route?.message)
        route.message = '';

      if (!route?.body)
        route.body = null;
      
      if (route.next)
        next();
      else
        res.status(route.status)
        .json({
          status: route.status,
          message: route.message,
          body: route.body
        });
      
    }
    catch(err) {
      console.error(err);
      res.status(500).json({
        status: '500',
        message: 'Default message, to be fully implemented',
        body:null
      })
    }
  }
}


function applyRoutes(app: any, routess: any[]) {
  routess.forEach((route: {method:string, path: string, handler:any|any[]}) => {
    let { method, path, handler } = route;
    if (!Array.isArray(handler))
      handler = [handler];
    
    handler = routeHandlerWrapper(handler[0]);

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
