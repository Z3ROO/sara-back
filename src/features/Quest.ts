import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { INewQuest, IQuest } from "./interfaces/interfaces";
import { Questline } from "./Questline";

export class Quest {
  static async getActiveMainQuest() {
    const quest = await QuestRepo.findActiveMainQuest();

    if (!quest)
      throw new BadRequest("No active quest found");
    
    return quest
  }

  static async getActiveSideQuest() {
    const quest = await QuestRepo.findActiveSideQuest();

    if (!quest)
      return null;

    return quest;
  }

  static async getAllUnfineshedSideQuest() {
    const quests = await QuestRepo.findAllUnfineshedSideQuests();
    return quests;
  }

  static async getAllFinishedQuests() {
    const quests = await QuestRepo.findAllFinishedQuests();
    return quests;
  }
  
  static async getEveryFinishedQuestOfOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));
    const quests = await QuestRepo.findAllFinishedQuestsInDateRange({begin, end});

    return quests;
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

  static async createNewQuest(properties: INewQuest) {
    const {_id} = await Questline.getActiveQuestline(); /* throws if none */

    if (_id.toHexString() !== properties.questline_id)
      throw new BadRequest('Issued questline_id does not match with current Questline');

    await QuestRepo.insertNewQuest(properties);
  }

  static async insertDistractionPoint() {
    const activeQuest = await this.getActiveMainQuest();

    await QuestRepo.insertDistractionPoint(activeQuest._id.toString());
  }

  static async finishQuest(identifier: string, focus_score: number) {
    await QuestRepo.finishQuest(identifier, focus_score);
  }

  static async activateSideQuest(identifier: string) {
    return QuestRepo.activateSideQuest(identifier);
  }
}