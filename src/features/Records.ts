import RecordsRepo from "../repositories/RecordsRepo";
import { INewRecord, IQuest, IRecords } from "./interfaces/interfaces";
import { isObjectId } from "../infra/database/mongodb";
import { BadRequest } from "../util/errors/HttpStatusCode";
import { WithId } from "mongodb";

export class Records {
  static async getAllRecords() {
    const records = await RecordsRepo.findAllRecords();
    return records
  }

  static async getRecordById(record_id: string) {
    if (!isObjectId(record_id))
      throw new BadRequest('Invalid record_id');

    return await RecordsRepo.findOneRecord(record_id);
  }

  static async getRecordsByCategory(categories: string|string[]) {
    if (typeof categories === 'string')
      categories = [categories];

    const records = await RecordsRepo.findRecordsByCategory(categories);
    return records;
  }

  static async getRecordsByQuestline(questline: string) {
    const records = await RecordsRepo.findRecordsByQuestline(questline);
    return records;
  }

  static async getRecordsWithHistoryInOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));
    
    const records = await RecordsRepo.findEveryRecordsHistoryInDateRange({begin, end});
    return records;
  }

  static async engage(quest: WithId<IQuest>) {
    const record = await Records.isEngageable(quest.record_id);
    
    if (record.metric === 'boolean') {
      let next_shot: Date;
      let progress_increase: number;
      let is_max_level = false;

      progress_increase = 0;

      if (quest.progress === 0) {
        next_shot = new Date();
        //verify other params like to-do to come up with date
      }      
      else if (quest.progress === 1) {
        if (record.level + 1 === record.levelCap) {
          next_shot = null;
          is_max_level = true;
        }
        else
          next_shot = new Date();
      }

      await RecordsRepo.updateRecordLevel(quest.record_id, progress_increase, quest.progress, next_shot, is_max_level);
      
      return;
    }

    if (record.metric === 'progress-made')
      quest.progress += record.progress;
    
    if (quest.progress === record.cap) {
      if (record.level+1 === record.cap) {

      }
    }
    //verify todos

  }

  private static async isEngageable(record: string|WithId<IRecords>): Promise<WithId<IRecords>> {
    if (typeof record === 'string')
      record = await Records.getRecordById(record)

    if (record.complete)
      throw new BadRequest(`Record '${record.title}' already complete`);

    const not_before = record.engageable.not_before;
    const not_after = record.engageable.not_after;
    const requirements = record.engageable.requirements;

    if (not_before && Date.now() < not_before.getTime())
      throw new BadRequest(`Cannot engage yet`);
      
    if (not_after && Date.now() > not_after.getTime())
      throw new BadRequest(`Cannot engage anymore`);

    if (requirements.length > 0 && await RecordsRepo.requirementsToComplete(requirements)) 
      throw new BadRequest(`Cannot engage yet, there is still requirements to comply`);

    return record
  }

  static async createNewRecord(properties: INewRecord) {    
    const {
      skill_id,
      title,
      description,
      todos,
      actionType,
      item_id,
      categories,
      metric,
      engageable
    } = properties;

    const itemType = 'book';
    const itemCap = 300;
    const itemMetricUnit = 'page';
    const itemDifficulty = 1;

    await RecordsRepo.insertOneRecord({
      skill_id,
      title,
      description,
      todos: todos.map(todo => ({ ...todo, finished_at: null, state: 'active' })),
      actionType,
      itemType,
      item_id,
      categories,
      progress: 0,
      cap: itemCap,
      level: 0,
      levelCap: 3,
      metric,
      metricUnit: itemMetricUnit,
      complete: false,
      difficulty: itemDifficulty,
      engageable,
      history: []
    });
  }
}