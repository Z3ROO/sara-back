import { Request } from "express";
import { INewQuestline } from "../../../../../features/interfaces/interfaces";
import { Questlines } from "../../../../../features/leveling/Questlines";

export default class QuestlinesAPIHandlers {

  //[GET]/quests/questline/
  static async getActiveQuestlines() {
    const questline = await Questlines.getActiveQuestline();

    return {
      body: questline
    };
  }

  //[GET]/quests/questline/all
  static async getAllQuestlines() {
    const questlines = await Questlines.getAllQuestlines();

    return {
      body: questlines
    };
  }

  //[GET]/quests/questline/all-finished
  static async getAllFinishedQuestlines() {
    const questlines = await Questlines.getAllFineshedQuestlines();

    return {
      body: questlines
    };
  }

  //[GET]/quests/questline/finish
  static async finishActiveQuestline() {
    await Questlines.terminateActiveQuestline('finished');
    
    return {
      status: 202,
      message: 'Questline finished'
    };
  }

  //[GET]/quests/questline/invalidate
  static async invalidateActiveQuestline() {
    await Questlines.terminateActiveQuestline('invalidated');
    
    return {
      status: 202,
      message: 'Questline invalidated'
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

    await Questlines.createNewQuestline(questline);

    return {
      status: 201,
      message: 'Questline created'
    };
  }

  //[GET]/quests/questline/:questline_id
  static async getOneQuestline(req: Request) {
    const { questline_id } = req.params;

    const questline = await Questlines.getOneQuestline(questline_id);

    return {
      body: questline
    };
  }  

  //[delete]/quests/questline/:questline_id
  static async deleteOneQuestline(req: Request) {
    const { questline_id } = req.params;

    await Questlines.deleteOneQuestline(questline_id);

    return {
      status: 202,
      message: 'Questline deleted'
    };
  }
}
