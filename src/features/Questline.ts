import QuestlineRepo from "../repositories/QuestlineRepo";
import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { INewQuestline, IQuestline } from "./interfaces/interfaces";

export class Questline {
  static async getActiveQuestline() {
    const questline = await QuestlineRepo.findActiveQuestline();

    if (!questline)
      throw new BadRequest('No active questline found');

    return questline
  }

  static async getAllQuestlines() {
    const questlines = await QuestlineRepo.findAllQuestlines();
    return questlines;
  }

  static async getAllFineshedQuestlines() {
    const questlines = await QuestlineRepo.findAllFinishedQuestlines();
    return questlines;
  }

  static async getOneQuestline(identifier: string) {
    const questline = await QuestlineRepo.findOneQuestline(identifier);
    return questline;
  }

  static async getFineshedQuestlinesOfOneDay(date: Date|string) {
    if (typeof date === 'string')
      date = new Date(date);

    const begin = new Date(date.setHours(0,0,0));
    const end =  new Date(date.setHours(23,59,59));
    const questlines = await QuestlineRepo.findFineshedQuestlineInDateRange({begin, end});

    return questlines
  }

  static async createNewQuestline(questline: INewQuestline) {
    return QuestlineRepo.createNewQuestline(questline);
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