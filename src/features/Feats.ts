import { FeatsRepo } from "../repositories/leveling/FeatsRepo";
import { IFeats } from "./interfaces/interfaces";

export class Feats {
  static async getAllFeats() {
    const { records } = await FeatsRepo.findAllFeats();

    return records
  }

  static async getEveryCompleteFeatOfOneDay(date: Date) {
    const beginning = date.toLocaleDateString('sv') + ' 00:00:00';
    const ending = date.toLocaleDateString('sv') + ' 23:59:59';
    const { records } = await FeatsRepo.findAllCompleteFeatsInDateRange(beginning, ending);

    return records
  }

  static async completeFeat(identifier: string) {
    let properties = {
        finished_at: FeatsRepo.currentDate(),
        completed: true
      }
    
    await FeatsRepo.updateOneFeat(identifier, properties)
  }

  static async createNewFeat(properties: IFeats) {
    properties = {
      ...properties,
      xp: properties.tier*50
    }
    await FeatsRepo.insertOneFeat(properties);
  }
}