import { Feats } from "../../features/Feats";
import { IFeats, IQuest, IQuestLine, IRecords } from "../../features/interfaces/interfaces";
import { Leveling } from "../../features/Leveling";
import { Quest } from "../../features/Quest";
import { QuestLine } from "../../features/Questline";
import { Records } from "../../features/Records";

export default class StatsAPIHandlers {
  //[GET]/leveling/stats
  static async getOverallStats(req: any, res: any) {
    await Leveling.init();
    const stats = Leveling.stats;

    return {
      body: {}
    };
  }

  //[GET]/leveling/active-quest
  static async getActiveQuest(req: any, res: any) {
    const questBody = await Quest.getActiveMainQuest();

    return {
      body: questBody
    };
  }

  //[GET]/leveling/questline/info/:id
  static async getQuestLineInfo(req: any, res: any) {
    const { id } = req.params;

    const questLine = await QuestLine.getOneQuestLine(id);

    return {
      body: questLine
    };
  }

  //[GET]/leveling/questline/list
  static async getListOfActiveQuestLines(req: any, res: any) {
    const questLines = await QuestLine.getAllActiveQuestLines();

    return {
      body: questLines
    };
  }

  //[POST]/leveling/quest/new-main
  static async createNewQuest(req: any, res: any) {
    const { questLine, title, description, timecap, type, xp, todos } = req.body;

    const questBody: Partial<IQuest> = {
      questline_id: questLine,
      title,
      description,
      timecap,
      type,
      todos,
      xp
    }

    await Quest.createNewQuest(questBody);

    return {
      status: 201,
      message: 'Quest created'
    };
  }

  //[POST]/leveling/quest/todo
  static async handleQuestTodo(req: any, res: any) {
    const { questId, todoDescription, action } = req.body;

    Quest.handleQuestTodo(questId, todoDescription, action);
    
    return {
      status: 202,
      message: 'To-do '+action
    };
  }

  //[POST]/leveling/quest/finish
  static async finishQuest(req: any, res: any) {
    const { questId, focusScore } = req.body;
    await Quest.finishQuest(questId, focusScore);
    
    return {
      status: 202,
      message: 'Quest finished'
    };
  }

  static async increaseDistractionScore(req: any, res: any) {
    await Quest.insertDistractionPoint();

    return {
      status: 202,
      message: 'Distraction score increased'
    };
  }

  static async finishMainQuestLine(req: any, res: any) {
    await QuestLine.finishMainQuestLine();
    
    return {
      status: 202,
      message: 'Questline finished'
    };
  }

  static async getAllFinishedQuestLines(req: any, res: any) {
    const questlines = await QuestLine.getAllFineshedQuestLines();

    return {
      body: questlines
    };
  }

  static async createNewQuestLine(req: any, res: any) {
    const { title, description, duration, type } = req.body;

    const questLine: Partial<IQuestLine> = {
      title,
      description,
      timecap: duration,
      type
    }

    await QuestLine.createNewQuestLine(questLine);
    const createdQuestLine = await QuestLine.getMainQuestLine();
    
    return {
      body: createdQuestLine
    };
  }
  

  
}