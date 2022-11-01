import QuestlineRepo from "../repositories/QuestlineRepo";
import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { IQuestline } from "./interfaces/interfaces";

export class Questline {
  static async getMainQuestline() {
    const questline = await QuestlineRepo.findMainQuestline();

    if (!questline)
      return null

    return questline
  }

  static async getAllActiveQuestlines() {
    const questlines = await QuestlineRepo.findAllActiveQuestlines();

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

  static async getOneActiveQuestline(identifier: string) {
    const questline = await QuestlineRepo.findOneQuestline(identifier);

    if (questline && questline.state !== 'active')
      throw new BadRequest('Questline already finished or invalidated');

    if (!questline)
      throw new BadRequest('Questline not found, verify questline_id property');

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

  static async createNewQuestline(questline: Partial<IQuestline>) {
    return QuestlineRepo.createNewQuestline(questline);
  }

  static async finishMainQuestline() {
    const questline = await QuestRepo.findMainQuest();
    
    if (questline)
      throw new BadRequest('Can\'t finish, a quest is currently active');

    const result = await QuestlineRepo.finishMainQuestline();

    if (!result)
      throw new BadRequest('No active Main Questline to be finished');
    
    return;
  }
}