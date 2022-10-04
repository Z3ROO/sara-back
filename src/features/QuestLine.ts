import { QuestLineRepo } from "../repositories/leveling/QuestLineRepo";
import { IQuestLine } from "./interfaces/interfaces";

export class QuestLine {
  static async getMainQuestLine() {
    const { record } = await QuestLineRepo.findMainQuestLine();
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

    const beginning = date.toLocaleDateString('sv') + ' 00:00:00';
    const ending =  date.toLocaleDateString('sv') + ' 23:59:59';
    const { records } = await QuestLineRepo.findFineshedQuestLineInDateRange(beginning, ending);

    return records
  }

  static async createNewQuestLine(questline: IQuestLine) {
    return QuestLineRepo.createNewQuestLine(questline);
  }

  static async finishMainQuestLine() {
    return QuestLineRepo.finishMainQuestLine();
  }
}