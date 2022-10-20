import { Feats } from "../../features/Leveling/Feats";
import { IQuest, IQuestLine } from "../../features/interfaces/interfaces";
import { Leveling } from "../../features/Leveling/Leveling";
import { Quest } from "../../features/Leveling/Quest";
import { QuestLine } from "../../features/Leveling/QuestLine";
import { Records } from "../../features/Leveling/Records";

export default class StatsAPIHandlers {
  //[GET]/leveling/stats
  static async getOverallStats(req: any, res: any) {
    await Leveling.init();
    const stats = Leveling.stats;

    res.json(stats);
  }

  //[GET]/leveling/active-quest
  static async getActiveQuest(req: any, res: any) {
    const questBody = await Quest.getActiveQuest();

    if (!questBody)
      res.json('no_quest_activated')
    else
      res.json(questBody);
  }

  //[GET]/leveling/questline/info/:id
  static async getQuestLineInfo(req: any, res: any) {
    const { id } = req.params;

    const questLine = await QuestLine.getOneQuestLine(id);

    res.json(questLine);
  }

  //[GET]/leveling/questline/list
  static async getListOfActiveQuestLines(req: any, res: any) {
    const questLines = await QuestLine.getAllActiveQuestLines();

    res.json(questLines);
  }

  //[POST]/leveling/quest/new-main
  static async createNewQuest(req: any, res: any) {
    const { questLine, title, description, timecap, type, xp, todos } = req.body;
    const mainQuestline = await QuestLine.getMainQuestLine();
    console.log(req.body)

    const questBody: IQuest = {
      questline_id: questLine,
      title,
      description,
      timecap,
      type,
      xp
    }

    await Quest.createNewQuest(questBody, todos);

    res.json({ok: true})
  }

  //[POST]/leveling/quest/todo
  static async handleQuestTodo(req: any, res: any) {
    const { todoId, action } = req.body;

    Quest.handlerQuestTodos(todoId, action);
    res.json({ok: true})
  }

  //[POST]/leveling/quest/finish
  static async finishQuest(req: any, res: any) {
    const { questId, focusScore } = req.body;
    await Quest.finishQuest(questId, focusScore);
    
    res.json({ok: true})
  }

  static async increaseDistractionScore(req: any, res: any) {
    await Quest.insertDistractionPoint();

    res.json({ok: true});
  }

  static async finishMainQuestLine(req: any, res: any) {
    await QuestLine.finishMainQuestLine();
    
    res.json({ok: true});
  }

  static async getAllFinishedQuestLines(req: any, res: any) {
    const questlines = await QuestLine.getAllFineshedQuestLines();

    res.json(questlines);
  }

  static async createNewQuestLine(req: any, res: any) {
    const { title, description, duration, type } = req.body;

    const questLine: IQuestLine = {
      title,
      description,
      timecap: duration,
      type
    }

    await QuestLine.createNewQuestLine(questLine);
    const createdQuestLine = await QuestLine.getMainQuestLine();
    res.json(createdQuestLine);
  }

  static async getFeats(req: any, res: any) {
    const feats = await Feats.getAllFeats();

    res.json(feats)
  }

  static async completeFeat(req: any, res: any) {
    const { featId } = req.body;

    await Feats.completeFeat(featId);

    res.json('updated');
  }

  static async createNewFeat(req: any, res: any) {
    const  {title, description, category, tier, questLine} = req.body

    await Feats.createNewFeat({
      title,
      description,
      categories: category,
      tier,
      questline_id: questLine
    });

    res.json('created')
  }

  static async getRecords(req: any, res: any) {
    const records = await Records.getAllRecords();

    res.json(records)
  }

  static async updateRecordLevel(req: any, res: any) {
    const { recordId, change } = req.body;

    await Records.updateRecordLevel(recordId, 'up')

    res.json('updated');
  }

  static async createNewRecord(req: any, res: any) {
    const  {title, description, qtd, categories, tier, questLine} = req.body

    await Records.createNewRecord({
      title,
      description,
      qtd,
      categories,
      tier,
      questline_id: questLine
    });

    res.json('created')
  }
}