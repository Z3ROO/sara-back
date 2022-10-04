import express from 'express';
import routes from '../../api-http-presenter';
import '../../../dotenv.config.ts'; // environment variables
import { dbCheck } from '../database/index';

export const app = applyRoutes(express(), routes);

export const init = () => dbCheck(() => {
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

init();

