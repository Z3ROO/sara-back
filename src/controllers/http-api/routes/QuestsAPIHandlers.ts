import { Request } from "express";
import { INewQuest, INewQuestline, IQuest, IQuestline } from "../../../features/interfaces/interfaces";
import { Quest } from "../../../features/Quest";
import { Questline } from "../../../features/Questline";
import { isObjectId } from "../../../infra/database/mongodb";
import QuestRepo from "../../../repositories/QuestRepo";
import { BadRequest } from "../../../util/errors/HttpStatusCode";
import { checkForMissingProperties } from "./utils";

export default class QuestsAPIHandlers {

  //[get]/tey  dev purposes
  static async teyzada() {
    return {
      body: await QuestRepo.findAllFinishedQuests()
    }
  }

  //[GET]/quests/questline/
  static async getListOfActiveQuestlines() {
    const questline = await Questline.getActiveQuestline();

    return {
      body: questline
    };
  }

  // ## TEST THIS ### /[GET]/quests/questline/all
  static async getAllQuestlines() {
    const questlines = await Questline.getAllQuestlines();

    return {
      body: questlines
    };
  }

  //[GET]/quests/questline/:questline_id
  static async getOneQuestline(req: Request) {
    const { questline_id } = req.params;

    const questline = await Questline.getOneQuestline(questline_id);

    return {
      body: questline
    };
  }  

  //[GET]/quests/questline/finish
  static async finishMainQuestline() {
    await Questline.terminateActiveQuestline('finished');
    
    return {
      status: 202,
      message: 'Questline finished'
    };
  }

  ///[GET]/quests/questline/all-finished
  static async getAllFinishedQuestlines() {
    const questlines = await Questline.getAllFineshedQuestlines();

    return {
      body: questlines
    };
  }

  //[POST]/quests/questline/new
  static async createNewQuestline(req: Request) {
    const { title, description, timecap } = req.body;
    
    const questline: INewQuestline = {
      title,
      description,
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
