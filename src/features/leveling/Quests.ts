import { isObjectId } from "../../infra/database/mongodb";
import QuestRepo from "../../repositories/leveling/QuestsRepo";
import { BadRequest } from "../../util/errors/HttpStatusCode";
import { Deeds } from "../Deeds";
import { INewQuest, IQuest } from "../interfaces/interfaces";
import { Questlines } from "./Questlines";

export class Quests {
  static async getActiveQuest() {
    const quest = await QuestRepo.findActiveQuest();

    if (!quest)
      throw new BadRequest("No active quest found");
    
    return quest
  }

  static async getOneQuest(quest_id: string) {
    const quest = await QuestRepo.findOneQuest(quest_id);
    return quest;
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

    const todoStatus = await this.getQuestTodoStatus(quest_id, todoDescription);

    if (todoStatus == null)
      throw new BadRequest('To-do not found, this to-do or quest may not exist');

    if (todoStatus !== 'active')
      throw new BadRequest('To-do already handled');


    if (action === 'invalidate')
      await QuestRepo.handleQuestTodo(quest_id, todoDescription,'invalidated');
    else if (action === 'finish')
      await QuestRepo.handleQuestTodo(quest_id, todoDescription,'finished');
      
    return;
  }

  static async createNewQuest(properties: INewQuest, questGroup: {questline?:boolean, skill?:string}) {
    let {
      questline_id,
      record_id,
      mission_id,
      title,
      description,
      todos,
      timecap
    } = properties;

    const activeQuest = await QuestRepo.findActiveQuest();    
    if (activeQuest)
      throw new BadRequest('An active quest already exist');
    
    if (questGroup.questline)
      questline_id = (await Questlines.getActiveQuestline())._id.toHexString();
    
    if (questGroup.skill)
      if (isObjectId(questGroup.skill))
        record_id = questGroup.skill;
      else
        throw new BadRequest('Invalid record_id')
    
    const isOnlyOneQuestGroup = [questline_id, record_id, mission_id].filter(v => v).length === 1;

    if (!isOnlyOneQuestGroup)
      throw new BadRequest('Quest groups are at least one and no more than that.')
      

    if (timecap < (10 * 60 * 1000))
      throw new BadRequest('timecap must be above 10 minutes')

    await QuestRepo.insertOneQuest({
      questline_id: questline_id ? questline_id : null,
      record_id: record_id ? record_id : null,
      mission_id: mission_id ? mission_id : null,
      title,
      description,
      todos: todos.map((todo) => ({
        doable_id: todo.doable_id,
        description: todo.description,
        state: 'active',
        finished_at: null,
      })),
      state: 'active',
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
    const activeQuest = await this.getActiveQuest();
    await QuestRepo.insertDistractionPoint(activeQuest._id.toString());
  }

  static async terminateQuest(focus_score: number, state: 'finished'|'invalidated') {
    const quest = await Quests.getActiveQuest();

    if (quest.mission_id) {

    } else {
      if (quest.record_id) {
        //act record
      }

      if (quest.questline_id) {
        
      }

    }

    //Remove finished deeds
    quest.todos.forEach(async todo => {
      if (todo.doable_id && todo.state === 'finished')
        await Deeds.deleteDeed(todo.doable_id);
    })

    await QuestRepo.terminateQuest(focus_score, state);
  }

  static async getQuestTodoStatus(quest_id: string, todoDescription: string) {
    const quest = await this.getOneQuest(quest_id);
    
    if (typeof quest.todos === 'string')
      throw new Error('There\'s no to-do in this quest');

    const todo = quest.todos.find(todo => (todo.description === todoDescription));
    
    if (todo)
      return todo.state;
    
    return null;
  }
}