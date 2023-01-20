import DeedsRepo from "../repositories/DeedsRepo";
import { IDeeds, INewDeed, IRecords, ITodo } from "./interfaces/interfaces";

export class Deeds {
  static async getAllDeeds() {
    const deeds = await DeedsRepo.findAllDeeds();
    return deeds
  }

  static async getDeedsByCategory(categories: string|string[]) {
    if (typeof categories === 'string')
      categories = [categories];

    const deeds = await DeedsRepo.findDeedsByCategory(categories);
    return deeds;
  }

  static async getEveryCompleteDeedOfOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));

    const deeds = await DeedsRepo.findAllCompleteDeedsInDateRange({begin, end});
    return deeds;
  }
    
  static async createNewDeed(properties: INewDeed) {
    let {
      description,
    } = properties;
   
    await DeedsRepo.insertOneDeed({
      description,
      categories: [],
      created_at: new Date()
    });
  }

  static async deleteDeed(deed_id: string) {
    await DeedsRepo.deleteOneDeed(deed_id);
  }
}