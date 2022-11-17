import { Request } from "express";
import { INewQuest } from "../../../../../features/interfaces/interfaces";
import { Quests } from "../../../../../features/leveling/Quests";
import { checkForMissingProperties } from "../../utils";

export default class QuestsAPIHandlers {
  
 //[GET]/quests/active-quest
  static async getActiveQuest() {
    const questBody = await Quests.getActiveQuest();

    return {
      body: questBody ? questBody : null
    };
  }

  //[POST]/quests/quest/new
  static async createNewQuest(req: Request) {
    const { questline } = req.query;
    const { title, description, timecap, type, todos } = req.body;
    
    const questBody: INewQuest = {
      // skill_id,
      // mission_id,
      title,
      description,
      timecap,
      type,
      todos
    }
    
    checkForMissingProperties(questBody);

    await Quests.createNewQuest(questBody, !!questline);

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

    await Quests.handleQuestTodo(quest_id, todoDescription, action);
    
    return {
      status: 202,
      message: 'To-do '+action
    };
  }

  //[POST]/quests/quest/finish
  static async finishQuest(req: Request) {
    const { quest_id, focusScore } = req.body;
    
    checkForMissingProperties({ quest_id, focusScore });

    await Quests.terminateQuest(quest_id, focusScore, 'finished');
    
    return {
      status: 202,
      message: 'Quest finished'
    };
  }

  //[POST]/quests/quest/invalidate
  static async invalidateQuest(req: Request) {
    const { quest_id, focusScore } = req.body;
    
    checkForMissingProperties({ quest_id, focusScore });

    await Quests.terminateQuest(quest_id, focusScore, 'invalidated');
    
    return {
      status: 202,
      message: 'Quest invalidated'
    };
  }

  //[GET]/quests/quest/distraction
  static async increaseDistractionScore() {
    await Quests.insertDistractionPoint();

    return {
      status: 202,
      message: 'Distraction score increased'
    };
  }  
}
