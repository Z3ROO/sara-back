import { initMongoDB } from "./infra/database/mongodb";
import { initServer } from "./infra/http-server";

(async function(){
  await initMongoDB()
  initServer();
})();