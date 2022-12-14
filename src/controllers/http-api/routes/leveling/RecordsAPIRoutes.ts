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
    method: 'get', path: '/records/up/:record_id',
    handler: async function updateRecordLevel(req: Request) {
      const { record_id } = req.params;
  
      await Records.updateRecordLevel(record_id, 1);
  
      return {
        status: 202,
        message: 'Record level updated'
      };
    }
  },
  {
    method: 'post', path: '/records/new',
    handler: async function createNewRecord(req: Request) {
      const  {
        title, description, metric, categories, questline_id,
        waitTime,
        stageAmount,
      } = req.body;
  
      const record: INewRecord = {
        questline_id,
        title,
        description,
        metric,
        status: {
          waitTime,
          stageAmount
        },
        categories
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