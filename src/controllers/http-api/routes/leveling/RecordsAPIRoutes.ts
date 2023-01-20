import { Request } from "express";
import { INewRecord, IRecords } from "../../../../features/interfaces/interfaces";
import { Records } from "../../../../features/Records";
import { checkForMissingProperties } from "../utils";


export default [  
  {
    method: 'get', path: '/records',
    handler: async function getRecords(req: any) {
      const records = await Records.getAllRecords();

      return {
        body: records
      }
    }
  },
  {
    method: 'post', path: '/records/new',
    handler: async function createNewRecord(req: Request) {
      const  {
        title, description, metric, categories, skill_id, engageable, todos, action_skill_id, item_id, item_type
      } = req.body;
  
      const record: INewRecord = {
        skill_id,
        action_skill_id,
        title,
        description,
        item_type,
        item_id,
        metric,
        engageable,
        categories,
        todos
      }

      checkForMissingProperties(record);

      await Records.createNewRecord(record);
  
      return {
        status: 201,
        message: 'Record created'
      }
    }
  }
]