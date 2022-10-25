import { Feats } from "../../features/Feats";
import { IFeats } from "../../features/interfaces/interfaces";

export default class FeatsAPIHandlers {

  static async getFeats(req: any, res: any) {
    const feats = await Feats.getAllFeats();

    return {
      body: feats
    }
  }

  static async completeFeat(req: any, res: any) {
    const { featId } = req.body;

    await Feats.completeFeat(featId);

    return {
      status: 202,
      message: 'Feat updated'
    };
  }

  static async createNewFeat(req: any, res: any) {
    const  {title, description, category, tier, questLine} = req.body

    const feat: Partial<IFeats> = {
      title,
      description,
      categories: category,
      tier,
      questline_id: questLine
    }

    await Feats.createNewFeat(feat);

    return {
      status: 201,
      message: 'Feat created'
    }
  }
}