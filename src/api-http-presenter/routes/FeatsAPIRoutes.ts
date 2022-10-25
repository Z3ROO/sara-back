import { Feats } from "../../features/Feats";
import { IFeats } from "../../features/interfaces/interfaces";

export default [
  {
    method: 'get', path: '/feats',
    handler: async function getFeats(req: any, res: any) {
      const feats = await Feats.getAllFeats();
  
      return {
        body: feats
      }
    }
  },
  {
    method: 'get', path: '/feats/complete/:featId',
    handler: async function completeFeat(req: any, res: any) {
      const { featId } = req.body;
  
      await Feats.completeFeat(featId);
  
      return {
        status: 202,
        message: 'Feat updated'
      };
    }
  },
  {
    method: 'post', path: '/feats/new',
    handler: async function createNewFeat(req: any, res: any) {
      const  {questLine, title, description, categories, todos, tier} = req.body
  
      const feat: Partial<IFeats> = {
        questline_id: questLine || null,
        title,
        description,
        todos: todos||null,
        categories: categories||null,
        tier
      }

      Object.keys(feat).forEach(key => {
        if (feat[key] === undefined)
          throw new Error('Missing parameter to insert feat')
      })
  
      await Feats.createNewFeat(feat);
  
      return {
        status: 201,
        message: 'Feat created'
      }
    }
  },
]