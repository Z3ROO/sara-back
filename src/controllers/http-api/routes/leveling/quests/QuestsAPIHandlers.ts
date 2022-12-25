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
    const { questline, record_id, mission_id, title, description, timecap, todos } = req.body;
    
    const questProps: INewQuest = {
      questline,
      record_id,
      mission_id: mission_id || null,
      title,
      description,
      timecap,
      todos
    }
    
    checkForMissingProperties(questProps);

    await Quests.createNewQuest(questProps);

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
    
    checkForMissingProperties({ focusScore });

    await Quests.terminateQuest(focusScore, 'finished');
    
    return {
      status: 202,
      message: 'Quest finished'
    };
  }

  //[POST]/quests/quest/invalidate
  static async invalidateQuest(req: Request) {
    const { quest_id, focusScore } = req.body;
    
    checkForMissingProperties({ focusScore });

    await Quests.terminateQuest( focusScore, 'invalidated');
    
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
