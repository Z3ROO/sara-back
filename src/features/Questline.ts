import { isObjectId } from "../infra/database/mongodb";
import QuestlineRepo from "../repositories/QuestlineRepo";
import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { INewQuestline, IQuestline } from "./interfaces/interfaces";

export class Questline {
  static async getActiveQuestline() {
    const questline = await QuestlineRepo.findActiveQuestline();

    if (!questline)
      throw new BadRequest('No active questline found');

    return questline;
  }

  static async getAllQuestlines() {
    const questlines = await QuestlineRepo.findAllQuestlines();
    return questlines;
  }

  static async getAllFineshedQuestlines() {
    const questlines = await QuestlineRepo.findAllFinishedQuestlines();
    return questlines;
  }

  static async getOneQuestline(questline_id: string) {
    
    if (!isObjectId(questline_id))
      throw new BadRequest('Invalid questline_id');

    const questline = await QuestlineRepo.findOneQuestline(questline_id);
    return questline;
  }

  static async getFineshedQuestlinesOfOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end =  new Date(date.setHours(23,59,59));
    const questlines = await QuestlineRepo.findFineshedQuestlinesInDateRange({begin, end});

    return questlines
  }

  static async createNewQuestline(properties: INewQuestline) {
    const { 
      title,
      description,
      timecap
    } = properties;

    const mainQuestline = await QuestlineRepo.findActiveQuestline();

    if (mainQuestline)
      throw new BadRequest('An active main questline already exist');

    return QuestlineRepo.insertOneQuestline({
      title,
      description,
      state: 'active',
      timecap: timecap,
      created_at: new Date(),
      finished_at: null,
      xp: null
    });
  }

  static async terminateActiveQuestline(action: 'finished'|'invalidated') {
    const questline = await QuestRepo.findActiveMainQuest();
    
    if (questline)
      throw new BadRequest('Can\'t finish, a quest is currently active');

    const result = await QuestlineRepo.terminateActiveQuestline(action);

    if (!result)
      throw new BadRequest('No active Main Questline to be finished');
    
    return;
  }
}