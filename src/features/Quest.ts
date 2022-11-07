import { isObjectId } from "../infra/database/mongodb";
import QuestRepo from "../repositories/QuestRepo";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { INewQuest, IQuest } from "./interfaces/interfaces";
import { Questlines } from "./leveling/Questlines";

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

  static async handleQuestTodo(quest_id: string, todoDescription: string, action: 'invalidate'|'finish') {
    if (!isObjectId(quest_id))
      throw new BadRequest('Invalid quest_id');

    const todoStatus = await QuestRepo.questTodoStatus(quest_id, todoDescription);

    if (todoStatus == null)
      throw new BadRequest('To-do not found, this to-do or quest may not exist');

    if (todoStatus !== 'active')
      throw new BadRequest('To-do already handled');


    if (action === 'invalidate')
      await QuestRepo.invalidateQuestTodo(quest_id, todoDescription);
    else if (action === 'finish')
      await QuestRepo.finishQuestTodo(quest_id, todoDescription);
      
    return;
  }

  static async createNewQuest(properties: INewQuest) {
    const { 
      questline_id,
      skill_id,
      mission_id,
      title,
      description,
      type,
      todos,
      timecap
    } = properties;

    if (!isObjectId(questline_id))
      throw new BadRequest('Invalid questline_id')

    //==== THIS SNIPET ASSUMES THAT I ALWAYS HAVE questline_id
    const {_id} = await Questlines.getActiveQuestline(); /* throws if none */

    if (_id.toHexString() !== properties.questline_id)
      throw new BadRequest('Issued questline_id does not match with current Questline');
    //==========================================================

    if (type === 'main') {
      const mainQuest = await QuestRepo.findActiveMainQuest();

      if (mainQuest)
        throw new BadRequest('An active main quest already exist');
    }
    else if (type === 'side'){
      const sideQuests = await QuestRepo.findAllUnfineshedSideQuests();

      if (sideQuests.length >= 5)
        throw new BadRequest('Maximun amount of side quests pre-registered reached');
    }

    await QuestRepo.insertOneQuest({
      questline_id: questline_id ? questline_id : null,
      skill_id: skill_id ? skill_id : null,
      mission_id: mission_id ? mission_id : null,
      title,
      description,
      type,
      state: ['main','practice'].includes(type) ? 'active' : 'deferred',
      todos: todos.map((todo: string) => ({description: todo, state: 'active', finished_at: null})),
      timecap,
      pause: [],
      focus_score: 0,
      distraction_score: [],
      created_at: new Date(),
      finished_at: null,
      xp: null
    });
  }

  static async insertDistractionPoint() {
    const activeQuest = await this.getActiveMainQuest();
    await QuestRepo.insertDistractionPoint(activeQuest._id.toString());
  }

  static async finishQuest(quest_id: string, focus_score: number) {
    if (!isObjectId(quest_id))
      throw new BadRequest('Invalid quest_id');

    await QuestRepo.finishQuest(quest_id, focus_score);
  }

  static async activateSideQuest(quest_id: string) {
    return QuestRepo.activateSideQuest(quest_id);
  }
}