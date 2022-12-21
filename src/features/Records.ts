import RecordsRepo from "../repositories/RecordsRepo";
import { INewRecord, IRecords, RecordsActions } from "./interfaces/interfaces";
import { nextAcceptanceLevel } from "./Feats";
import { isObjectId } from "../infra/database/mongodb";
import { BadRequest } from "../util/errors/HttpStatusCode";

export class Records {
  static async getAllRecords() {
    const records = await RecordsRepo.findAllRecords();
    return records
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

  static async updateRecordLevel(record_id: string, action: RecordsActions, progress: number) {
    if (!isObjectId(record_id))
      throw new BadRequest('Invalid record_id');

    await RecordsRepo.updateRecordLevel(record_id, action, progress);
  }

  static async createNewRecord(properties: INewRecord) {    
    const {
      skill_id,
      title,
      description,
      todos,
      type,
      categories
    } = properties;

    await RecordsRepo.insertOneRecord({
      skill_id: skill_id ? skill_id : null,
      title,
      description,
      todos,
      type,
      categories: categories ? categories : [],
      actions: {}
    });
  }
}