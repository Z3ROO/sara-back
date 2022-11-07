import { Request } from "express";
import { INewQuest } from "../../../../../features/interfaces/interfaces";
import { Quest } from "../../../../../features/Quest";
import QuestRepo from "../../../../../repositories/QuestRepo";
import { checkForMissingProperties } from "../../utils";

export default class QuestsAPIHandlers {

  //[get]/tey  dev purposes
  static async teyzada() {
    return {
      body: await QuestRepo.findAllFinishedQuests()
    }
  }

 //[GET]/quests/active-quest
  static async getActiveQuest() {
    const questBody = await Quest.getActiveMainQuest();

    return {
      body: questBody ? questBody : null
    };
  }

  //[POST]/quests/quest/new
  static async createNewQuest(req: Request) {
    const { questline_id, title, description, timecap, type, todos } = req.body;
    
    const questBody: INewQuest = {
      // skill_id,
      // mission_id,
      questline_id,
      title,
      description,
      timecap,
      type,
      todos
    }
    
    checkForMissingProperties(questBody);

    await Quest.createNewQuest(questBody);

    return {
      status: 201,
      message: 'Quest created'
    };
  }

  //[POST]/quests/quest/handle-todo
  static async handleQuestTodo(req: Request) {
    const { 
      quest_id, 
      todoDescription, 
      action 
    } = req.body;

    checkForMissingProperties({ 
      quest_id, 
      todoDescription, 
      action 
    });

    await Quest.handleQuestTodo(quest_id, todoDescription, action);
    
    return {
      status: 202,
      message: 'To-do '+action
    };
  }

  //[POST]/quests/quest/finish
  static async finishQuest(req: Request) {
    const { quest_id, focusScore } = req.body;
    
    checkForMissingProperties({ quest_id, focusScore });

    await Quest.finishQuest(quest_id, focusScore);
    
    return {
      status: 202,
      message: 'Quest finished'
    };
  }

  //[GET]/quests/quest/distraction
  static async increaseDistractionScore() {
    await Quest.insertDistractionPoint();

    return {
      status: 202,
      message: 'Distraction score increased'
    };
  }  
}
