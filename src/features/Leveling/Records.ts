import RecordsRepo from "../../repositories/leveling/RecordsRepo";
import { IRecords } from "../interfaces/interfaces";

export class Records {
  static async getAllRecords() {
    const { records } = await RecordsRepo.findAllRecords();

    return records
  }

  static async getRecordsByCategory(categories: string|string[]) {
    if (typeof categories === 'string')
      categories = [categories];
      
    const { records } = await RecordsRepo.findRecordsByCategory(categories);

    return records
  }

  static async getRecordsByQuestline(questline: string) {
    const { records } = await RecordsRepo.findRecordsByQuestline(questline);

    return records
  }

  static async getRecordsWithHistoryInOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));
    
    const { records } = await RecordsRepo.findEveryRecordsHistoryInDateRange({begin, end});

    return records;
  }

  static async updateRecordLevel(identifier: string, direction: -1|0|1) {
    if (direction < -1 || direction > 1)
      throw new Error('Direction must be -1, 0 or 1');

    await RecordsRepo.updateRecordLevel({_id: identifier}, direction);
  }

  static async createNewRecord(properties: Partial<IRecords>) {
    const {
      questline_id,
      title,
      description,
      metric,
      status,
      categories,
      level,
      history,
      xp
    } = properties;
    
    await RecordsRepo.insertOneRecord(properties);
  }
}