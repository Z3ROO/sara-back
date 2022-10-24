import FeatsRepo from "../../repositories/leveling/FeatsRepo";
import { IFeats, IRecords } from "../interfaces/interfaces";
//feat/record under analysis
export class Feats {
  static async getAllFeats() {
    const { records } = await FeatsRepo.findAllFeats();

    return records
  }

  static async getFeatsByCategory(categories: string|string[]) {
    if (typeof categories === 'string')
      categories = [categories];

    const { records } = await FeatsRepo.findFeatsByCategory(categories)

    return records;
  }
  
  static async getFeatsByQuestline(questline: string) {
    const { records } = await FeatsRepo.findFeatsByQuestline(questline)

    return records;
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
      acceptance,
      todos,
      categories,
      tier,
      completed,
      xp,
      finished_at,
    } = properties;
    
    await FeatsRepo.insertOneFeat(properties);
  }

  static async proceedFeatAcceptanceLevel(identifier: string) {
    const feat = (await FeatsRepo.findOneFeat({_id: identifier})).record;
    const stage = proceedAcceptanceLevel(feat);

    await FeatsRepo.proceedAcceptanceLevel({_id: identifier}, stage);
  }
}


export function proceedAcceptanceLevel(item: IRecords|IFeats): 'reviewed'|'ready' {
  const sevenDays = 1000 * 60 * 60 * 24 * 7;
    let stage: 'reviewed'|'ready';

    if (item.acceptance.stage === 'ready')
      throw new Error('This \'feat\' already got accepted.');
      
    if (item.acceptance.stage === 'reviewed' &&
      (item.acceptance.date[0].setHours(0,0,0) + sevenDays) < new Date().getTime())
      stage = 'ready'
    if (item.acceptance.stage === 'created' &&
      (item.acceptance.date[1].setHours(0,0,0) + sevenDays) < new Date().getTime())
      stage = 'reviewed'
    else
      throw new Error("Something went wrong proceeding Feat acceptance.");

  return stage
}