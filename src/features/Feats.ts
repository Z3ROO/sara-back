import FeatsRepo from "../repositories/FeatsRepo";
import { IFeats, INewFeat, IRecords, ITodo } from "./interfaces/interfaces";

export class Feats {
  static async getAllFeats() {
    const feats = await FeatsRepo.findAllFeats();
    return feats
  }

  static async getFeatsByCategory(categories: string|string[]) {
    if (typeof categories === 'string')
      categories = [categories];

    const feats = await FeatsRepo.findFeatsByCategory(categories);
    return feats;
  }
  
  static async getFeatsByQuestline(questline_id: string) {
    const feats = await FeatsRepo.findFeatsByQuestline(questline_id);
    return feats;
  }

  static async getEveryCompleteFeatOfOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));

    const feats = await FeatsRepo.findAllCompleteFeatsInDateRange({begin, end});
    return feats;
  }

  static async completeFeat(feat_id: string) {
    let properties = {
        finished_at: new Date(),
        completed: true
      };
    await FeatsRepo.updateOneFeat(feat_id, properties);
  }

  static async createNewFeat(properties: INewFeat) {
    let {
      questline_id,
      skill_id,
      title,
      description,
      todos,
      categories,
      tier
    } = properties;
  
    const parsedTodos: ITodo[]|null = todos ? todos.map((todo) => ({description: todo, state: 'active', finished_at: null})) : null;
    
    await FeatsRepo.insertOneFeat({
      questline_id: questline_id ? questline_id : null,
      skill_id: skill_id ? skill_id : null,
      title,
      description,
      acceptance: {
        stage: 'created',
        date: [new Date()]
      },
      todos: parsedTodos,
      categories,
      tier,
      completed: false,
      xp: tier*50,
      finished_at: null
    });
  }
}
