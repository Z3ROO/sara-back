import FeatsRepo from "../../repositories/leveling/FeatsRepo";
import { IFeats } from "../interfaces/interfaces";

export class Feats {
  static async getAllFeats() {
    const { records } = await FeatsRepo.findAllFeats();

    return records
  }

  static async getEveryCompleteFeatOfOneDay(date: Date) {
    const begin = date.toLocaleDateString('sv') + ' 00:00:00';
    const end = date.toLocaleDateString('sv') + ' 23:59:59';
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

  static async createNewFeat(properties: IFeats) {
    properties = {
      ...properties,
      xp: properties.tier*50
    }
    await FeatsRepo.insertOneFeat(properties);
  }
}