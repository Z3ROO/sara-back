import { IQuest, IQuestline } from "../../features/interfaces/interfaces";
import { Quest } from "../../features/Quest";
import { Questline } from "../../features/Questline";
import { isObjectId } from "../../infra/database/mongodb";
import { BadRequest } from "../../util/errors/HttpStatusCode";
import { checkForMissingProperties } from "./utils";

export default class QuestsAPIHandlers {

  //[GET]/quests/questline/
  static async getListOfActiveQuestlines(req: any) {
    const questlines = await Questline.getAllActiveQuestlines();

    return {
      body: questlines
    };
  }

  //[GET]/quests/questline/:questline_id
  static async getQuestlineInfo(req: any) {
    const { questline_id } = req.params;

    if (!isObjectId(questline_id))
      throw new BadRequest('Invalid questline_id')

    const questline = await Questline.getOneQuestline(questline_id);

    return {
      body: questline
    };
  }  

  //[GET]/quests/questline/finish
  static async finishMainQuestline(req: any, res: any) {
    await Questline.finishMainQuestline();
    
    return {
      status: 202,
      message: 'Questline finished'
    };
  }

  ///[GET]/quests/questline/all-finished
  static async getAllFinishedQuestlines(req: any, res: any) {
    const questlines = await Questline.getAllFineshedQuestlines();

    return {
      body: questlines
    };
  }

  //[POST]/quests/questline/new
  static async createNewQuestline(req: any, res: any) {
    const { title, description, timecap, type } = req.body;
    
    const questline: Partial<IQuestline> = {
      title,
      description,
      type,
      timecap
    }
    
    checkForMissingProperties(questline);
    await Questline.createNewQuestline(questline);

    return {
      status: 201,
      message: 'Questline created'
    };
  }

  //[GET]/quests/active-quest
  static async getActiveQuest(req: any) {
    const questBody = await Quest.getActiveMainQuest();

    return {
      body: questBody ? questBody : null
    };
  }

  //[POST]/quests/quest/new
  static async createNewQuest(req: any) {
    const { questline_id, title, description, timecap, type, todos } = req.body;
    
    const questBody: Partial<IQuest> = {
      questline_id,
      title,
      description,
      timecap,
      type,
      todos
    }
    
    checkForMissingProperties(questBody);

    if (!isObjectId(questline_id))
      throw new BadRequest('Invalid questline_id')

    await Quest.createNewQuest(questBody);

    return {
      status: 201,
      message: 'Quest created'
    };
  }

  //[POST]/quests/quest/handle-todo
  static async handleQuestTodo(req: any, res: any) {
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

    if (!isObjectId(quest_id))
      throw new BadRequest('Invalid quest_id')

    await Quest.handleQuestTodo(quest_id, todoDescription, action);
    
    return {
      status: 202,
      message: 'To-do '+action
    };
  }

  //[POST]/quests/quest/finish
  static async finishQuest(req: any, res: any) {
    const { quest_id, focusScore } = req.body;
    
    checkForMissingProperties({ quest_id, focusScore });

    if (!isObjectId(quest_id))
      throw new BadRequest('Invalid quest_id');

    await Quest.finishQuest(quest_id, focusScore);
    
    return {
      status: 202,
      message: 'Quest finished'
    };
  }

  //[GET]/quests/quest/distraction
  static async increaseDistractionScore(req: any, res: any) {
    await Quest.insertDistractionPoint();

    return {
      status: 202,
      message: 'Distraction score increased'
    };
  }
  
}