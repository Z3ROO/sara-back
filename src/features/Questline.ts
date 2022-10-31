import QuestLineRepo from "../repositories/QuestLineRepo";
import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { IQuestLine } from "./interfaces/interfaces";

export class QuestLine {
  static async getMainQuestLine() {
    const { record } = await QuestLineRepo.findMainQuestLine();

    if (!record)
      return null

    return record
  }

  static async getAllActiveQuestLines() {
    const { records } = await QuestLineRepo.findAllActiveQuestLines();

    return records;
  }

  static async getAllFineshedQuestLines() {
    const { records } = await QuestLineRepo.findAllFinishedQuestLines();
    return records;
  }

  static async getOneQuestLine(identifier: string) {
    const { record } = await QuestLineRepo.findOneQuestLine(identifier);
    return record;
  }

  static async getFineshedQuestLinesOfOneDay(date: Date|string) {
    if (typeof date === 'string')
      date = new Date(date);

    const begin = new Date(date.setHours(0,0,0));
    const end =  new Date(date.setHours(23,59,59));
    const { records } = await QuestLineRepo.findFineshedQuestLineInDateRange({begin, end});

    return records
  }

  static async createNewQuestLine(questline: Partial<IQuestLine>) {
    return QuestLineRepo.createNewQuestLine(questline);
  }

  static async finishMainQuestLine() {
    const { record } = await QuestRepo.findMainQuest();
    
    if (record)
      throw new BadRequest('Can\'t finish, a quest is currently active');

    const result = await QuestLineRepo.finishMainQuestLine();

    if (!result)
      throw new BadRequest('No active Main Questline to be finished');
    
    return;
  }
}