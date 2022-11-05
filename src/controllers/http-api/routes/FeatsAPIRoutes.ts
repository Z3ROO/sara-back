import { Request } from "express";
import { Feats } from "../../../features/Feats";
import { INewFeat } from "../../../features/interfaces/interfaces";
import { isObjectId } from "../../../infra/database/mongodb";
import { BadRequest } from "../../../util/errors/HttpStatusCode";
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
    method: 'get', path: '/feats/complete/:feat_id',
    handler: async function completeFeat(req: any, res: any) {
      const { feat_id } = req.params;
      
      if (!isObjectId(feat_id))
        throw new BadRequest(`Invalid feat_id`);

      await Feats.completeFeat(feat_id);
  
      return {
        status: 202,
        message: 'Feat completed'
      };
    }
  },
  {
    method: 'post', path: '/feats/new',
    handler: async function createNewFeat(req: Request, res: any) {
      const  {questline_id, skill_id, title, description, categories, todos, tier} = req.body
  
      const feat: INewFeat = {
        questline_id: questline_id || null,
        skill_id: skill_id || null,
        title,
        description,
        todos: todos||null,
        categories: categories||[],
        tier
      }

      checkForMissingProperties(feat);
      
      if (!isObjectId(questline_id))
        throw new BadRequest(`Invalid questline_id`);
  
      await Feats.createNewFeat(feat);
  
      return {
        status: 201,
        message: 'Feat created'
      }
    }
  },
]