import { IRecords } from "../../features/interfaces/interfaces";
import { Records } from "../../features/Records";
import { checkForMissingProperties } from "./utils";


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
    handler: async function updateRecordLevel(req: any) {
      const { record_id } = req.params;
  
      await Records.updateRecordLevel(record_id, 1);
  
      return {
        status: 202,
        message: 'updated'
      };
    }
  },
  {
    method: 'post', path: '/records/new',
    handler: async function createNewRecord(req: any) {
      const  {
        title, description, metric, categories, questLine,
        waitTime,
        stageAmount,
      } = req.body
  
      const record: Partial<IRecords> = {
        questline_id: questLine,
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
        message: 'created'
      }
    }
  }
]