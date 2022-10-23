import { Feats } from "../../features/Leveling/Feats";
import { IFeats, IQuest, IQuestLine, IRecords } from "../../features/interfaces/interfaces";
import { Leveling } from "../../features/Leveling/Leveling";
import { Quest } from "../../features/Leveling/Quest";
import { QuestLine } from "../../features/Leveling/QuestLine";
import { Records } from "../../features/Leveling/Records";

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

  static async getFeats(req: any, res: any) {
    const feats = await Feats.getAllFeats();

    return {
      body: feats
    }
  }

  static async completeFeat(req: any, res: any) {
    const { featId } = req.body;

    await Feats.completeFeat(featId);

    return {
      status: 202,
      message: 'Feat updated'
    };
  }

  static async createNewFeat(req: any, res: any) {
    const  {title, description, category, tier, questLine} = req.body

    const feat: Partial<IFeats> = {
      title,
      description,
      categories: category,
      tier,
      questline_id: questLine
    }

    await Feats.createNewFeat(feat);

    return {
      status: 201,
      message: 'Feat created'
    }
  }

  static async getRecords(req: any, res: any) {
    const records = await Records.getAllRecords();

    return {
      body: records
    }
  }

  static async updateRecordLevel(req: any, res: any) {
    const { recordId, change } = req.body;

    await Records.updateRecordLevel(recordId, 'up');

    return {
      status: 202,
      message: 'updated'
    };
  }

  static async createNewRecord(req: any, res: any) {
    const  {title, description, metric, categories, questLine} = req.body

    const record: Partial<IRecords> = {
      questline_id: questLine,
      title,
      description,
      metric,
      categories
    }

    await Records.createNewRecord(record);

    return {
      status: 201,
      message: 'created'
    }
  }
}