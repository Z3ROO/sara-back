import { Feats } from "../../features/Feats";
import { IFeats } from "../../features/interfaces/interfaces";
import { checkForMissingProperties } from "./utils";

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
      const  {questline_id, title, description, categories, todos, tier} = req.body
  
      const feat: Partial<IFeats> = {
        questline_id: questline_id || null,
        title,
        description,
        todos: todos||null,
        categories: categories||null,
        tier
      }

      checkForMissingProperties(feat)
  
      await Feats.createNewFeat(feat);
  
      return {
        status: 201,
        message: 'Feat created'
      }
    }
  },
]