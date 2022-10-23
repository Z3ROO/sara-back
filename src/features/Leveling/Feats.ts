import FeatsRepo from "../../repositories/leveling/FeatsRepo";
import { IFeats } from "../interfaces/interfaces";

export class Feats {
  static async getAllFeats() {
    const { records } = await FeatsRepo.findAllFeats();

    return records
  }

  static async getEveryCompleteFeatOfOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));
    const { records } = await FeatsRepo.findAllCompleteFeatsInDateRange({begin, end});

    return records
  }

  static async completeFeat(identifier: string) {
    let properties = {
        finished_at: new Date(),
        completed: true
      }

    await FeatsRepo.updateOneFeat({_id: identifier}, properties)
  }

  static async createNewFeat(properties: Partial<IFeats>) {
    const {
      questline_id,
      title,
      description,
      todos,
      categories,
      tier,
      completed,
      xp,
      created_at,
      finished_at,
    } = properties;
    
    await FeatsRepo.insertOneFeat(properties);
  }
}