import { IRecords } from "../../features/interfaces/interfaces";
import { Records } from "../../features/Records";


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
    method: 'get', path: '/records/up/:recordId',
    handler: async function updateRecordLevel(req: any) {
      const { recordId } = req.params;
  
      await Records.updateRecordLevel(recordId, 1);
  
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
  
      await Records.createNewRecord(record);
  
      return {
        status: 201,
        message: 'created'
      }
    }
  }
]