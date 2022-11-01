import QuestlineRepo from "../repositories/QuestlineRepo";
import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { IQuestline } from "./interfaces/interfaces";

export class Questline {
  static async getMainQuestline() {
    const { record } = await QuestlineRepo.findMainQuestline();

    if (!record)
      return null

    return record
  }

  static async getAllActiveQuestlines() {
    const { records } = await QuestlineRepo.findAllActiveQuestlines();

    return records;
  }

  static async getAllFineshedQuestlines() {
    const { records } = await QuestlineRepo.findAllFinishedQuestlines();
    return records;
  }

  static async getOneQuestline(identifier: string) {
    const { record } = await QuestlineRepo.findOneQuestline(identifier);
    return record;
  }

  static async getOneActiveQuestline(identifier: string) {
    const { record } = await QuestlineRepo.findOneQuestline(identifier);

    if (record && record.state !== 'active')
      throw new BadRequest('Questline already finished or invalidated');

    if (!record)
      throw new BadRequest('Questline not found, verify questline_id property');

    return record;
  }

  static async getFineshedQuestlinesOfOneDay(date: Date|string) {
    if (typeof date === 'string')
      date = new Date(date);

    const begin = new Date(date.setHours(0,0,0));
    const end =  new Date(date.setHours(23,59,59));
    const { records } = await QuestlineRepo.findFineshedQuestlineInDateRange({begin, end});

    return records
  }

  static async createNewQuestline(questline: Partial<IQuestline>) {
    return QuestlineRepo.createNewQuestline(questline);
  }

  static async finishMainQuestline() {
    const { record } = await QuestRepo.findMainQuest();
    
    if (record)
      throw new BadRequest('Can\'t finish, a quest is currently active');

    const result = await QuestlineRepo.finishMainQuestline();

    if (!result)
      throw new BadRequest('No active Main Questline to be finished');
    
    return;
  }
}