import { QuestRepo } from "../repositories/leveling/QuestRepo";
import { QuestTodosRepo } from "../repositories/leveling/QuestTodosRepo";
import { IQuest } from "./interfaces/interfaces";
import { QuestLine } from "./QuestLine";

export class Quest {
  static async getActiveQuest() {
    const quest = await this.getMainQuest();
    if (quest){
      const todos = await this.getQuestTodos(quest.id);
      return {
        ...quest,
        todos
      }
    }

    return
  }

  static async getMainQuest() {
    const { record } = await QuestRepo.findMainQuest();
    return record;
  }

  static async getActiveSideQuest() {
    const { record } = await QuestRepo.findActiveSideQuest();
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
    const beginning = date.toLocaleDateString('sv') + ' 00:00:00';
    const ending = date.toLocaleDateString('sv') + ' 23:59:59';
    const { records } = await QuestRepo.findAllFinishedQuestsInDateRange(beginning, ending);

    return records;
  }

  static async getQuestTodos(questIdentifier: string) {
    const { records } = await QuestTodosRepo.findAllQuestTodos(questIdentifier);
    return records;
  }

  static async handlerQuestTodos(todoIdentifier: string, action: 'invalidate'|'finish') {
    if (action === 'invalidate')
      await QuestTodosRepo.invalidateQuestTodo(todoIdentifier);
    else if (action === 'finish')
      await QuestTodosRepo.finishQuestTodo(todoIdentifier);
    return;
  }

  static async createNewQuest(quest: IQuest, todos: string[]) {
    const questline = await QuestLine.getMainQuestLine();
    quest = {
      questline_id: questline.id,
      ...quest
    };
    const { id } = await QuestRepo.insertNewQuest(quest);
    await QuestTodosRepo.createBatchOFTodos(id, todos);
    return
  }

  static async insertDistractionPoint() {
    const activeQuest = await QuestRepo.findMainQuest();
    await QuestRepo.insertDistractionPoint(activeQuest.record.id);
  }

  static async finishQuest(identifier: string, focus_score: number) {
    await QuestRepo.finishQuest(identifier, focus_score);
  }

  static async activateSideQuest(identifier: string) {
    return QuestRepo.activateSideQuest(identifier);
  }

}