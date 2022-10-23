import QuestRepo from "../../repositories/leveling/QuestRepo";
import { IQuest } from "../interfaces/interfaces";

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

  static async getAllSideQuest() {
    const { records } = await QuestRepo.findAllSideQuests();
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
    if (action === 'invalidate')
      await QuestRepo.invalidateQuestTodo(questIdentifier, todoIdentifier);
    else if (action === 'finish')
      await QuestRepo.finishQuestTodo(questIdentifier, todoIdentifier);
    return;
  }

  static async createNewQuest(properties: Partial<IQuest>) {
    await QuestRepo.insertNewQuest(properties);
  }

  static async insertDistractionPoint() {
    const activeQuest = await QuestRepo.findMainQuest();

    if (!activeQuest)
      throw new Error("No active main quest found. An active Quest must exist to insert distraction points.")

    await QuestRepo.insertDistractionPoint(activeQuest.record._id.toString());
  }

  static async finishQuest(identifier: string, focus_score: number) {
    await QuestRepo.finishQuest(identifier, focus_score);
  }

  static async activateSideQuest(identifier: string) {
    return QuestRepo.activateSideQuest(identifier);
  }
}