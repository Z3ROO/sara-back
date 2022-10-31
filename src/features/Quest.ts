import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { IQuest } from "./interfaces/interfaces";
import { QuestLine } from "./Questline";

export class Quest {
  static async getActiveMainQuest() {
    const { record } = await QuestRepo.findMainQuest();

    if (!record)
      return null
    
    return record
  }

  static async getActiveSideQuest() {
    const { record } = await QuestRepo.findActiveSideQuest();

    if (!record)
      return null;

    return record;
  }

  static async getAllUnfineshedSideQuest() {
    const { records } = await QuestRepo.findAllUnfineshedSideQuests();
    return records;
  }

  static async getAllFinishedQuests() {
    const { records } = await QuestRepo.findAllFinishedQuests();
    return records;
  }
  
  static async getEveryFinishedQuestOfOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));
    const { records } = await QuestRepo.findAllFinishedQuestsInDateRange({begin, end});

    return records;
  }

  static async handleQuestTodo(questIdentifier: string, todoIdentifier: string, action: 'invalidate'|'finish') {
    const todoStatus = await QuestRepo.questTodoStatus(questIdentifier, todoIdentifier);

    if (todoStatus == null)
      throw new BadRequest('To-do not found, this to-do or quest may not exist');

    if (todoStatus !== 'active')
      throw new BadRequest('To-do already handled');

    if (action === 'invalidate')
      await QuestRepo.invalidateQuestTodo(questIdentifier, todoIdentifier);
    else if (action === 'finish')
      await QuestRepo.finishQuestTodo(questIdentifier, todoIdentifier);
      
    return;
  }

  static async createNewQuest(properties: Partial<IQuest>) {
    const { questline_id } = properties;

    const isQuestlineValid = await QuestLine.getOneActiveQuestLine(questline_id);

    await QuestRepo.insertNewQuest(properties);
  }

  static async insertDistractionPoint() {
    const activeQuest = await QuestRepo.findMainQuest();

    if (activeQuest.record == null)
      throw new BadRequest("No active quest found");

    await QuestRepo.insertDistractionPoint(activeQuest.record._id.toString());
  }

  static async finishQuest(identifier: string, focus_score: number) {
    await QuestRepo.finishQuest(identifier, focus_score);
  }

  static async activateSideQuest(identifier: string) {
    return QuestRepo.activateSideQuest(identifier);
  }
}