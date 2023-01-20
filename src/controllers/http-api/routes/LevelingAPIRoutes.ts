import { Request } from "express";
//import { Leveling } from "../../../features/Leveling";
import { Stats } from "../../../features/Stats";

export default [
  {
    method: 'get', path: '/leveling/stats',
    handler: async function getOverallStats(req: any, res: any) {
      // await Leveling.init();
      // const stats = Leveling.stats;
  
      return {
        body: {}
      };
    }
  },
  {
    method: 'get', path: '/leveling/stats/gains-history',
    handler: async (req: Request) => {
      const {date} = req.query;
      let day: Date;

      if (date)
        day = new Date(date as string);
      else
        day = new Date();

      const history = await Stats.getGainsHistoryInOneDay(day);
      
      return {
        body: history
      }
    }
  }
];