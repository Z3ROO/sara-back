import { IQuest, IQuestLine } from "../../features/interfaces/interfaces";
import { Quest } from "../../features/Quest";
import { QuestLine } from "../../features/Questline";

export default class QuestsAPIHandlers {
   //[GET]/quests/active-quest
   static async getActiveQuest(req: any) {
    const questBody = await Quest.getActiveMainQuest();

    return {
      body: questBody
    };
  }

  //[GET]/quests/questline/:id
  static async getQuestLineInfo(req: any) {
    const { id } = req.params;

    const questLine = await QuestLine.getOneQuestLine(id);

    return {
      body: questLine
    };
  }

  //[GET]/quests/questline/
  static async getListOfActiveQuestLines(req: any) {
    const questLines = await QuestLine.getAllActiveQuestLines();

    return {
      body: questLines
    };
  }

  //[POST]/quests/quest/new
  static async createNewQuest(req: any) {
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

  //[POST]/quests/quest/handle-todo
  static async handleQuestTodo(req: any, res: any) {
    const { 
      questId, 
      todoDescription, 
      action 
    } = req.body;

    Quest.handleQuestTodo(questId, todoDescription, action);
    
    return {
      status: 202,
      message: 'To-do '+action
    };
  }

  //[POST]/quests/quest/finish
  static async finishQuest(req: any, res: any) {
    const { questId, focusScore } = req.body;
    await Quest.finishQuest(questId, focusScore);
    
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
  //[GET]/quests/questline/finish
  static async finishMainQuestLine(req: any, res: any) {
    await QuestLine.finishMainQuestLine();
    
    return {
      status: 202,
      message: 'Questline finished'
    };
  }
  ///[GET]/quests/questline/all-finished
  static async getAllFinishedQuestLines(req: any, res: any) {
    const questlines = await QuestLine.getAllFineshedQuestLines();

    return {
      body: questlines
    };
  }
  //[POST]/quests/questline/new
  static async createNewQuestLine(req: any, res: any) {
    const { title, description, duration, type } = req.body;

    const questLine: Partial<IQuestLine> = {
      title,
      description,
      type,
      timecap: duration
    }

    await QuestLine.createNewQuestLine(questLine);
    const createdQuestLine = await QuestLine.getMainQuestLine();
    
    return {
      body: createdQuestLine
    };
  }
  
}