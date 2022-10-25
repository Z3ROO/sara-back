import { Leveling } from "../../features/Leveling";

export default [
  {
    method: 'get', path: '/leveling/stats',
    handler: async function getOverallStats(req: any, res: any) {
      await Leveling.init();
      const stats = Leveling.stats;
  
      return {
        body: {}
      };
    }
  },
];