import RecordsRepo from "../../repositories/leveling/RecordsRepo";
import { IRecords } from "../interfaces/interfaces";

export class Records {
  static async getAllRecords() {
    const { records } = await RecordsRepo.findAllRecords();

    return records
  }

  static async getRecordsHistoryOfOneDay(date: Date) {
    const begin = new Date(date.setHours(0,0,0));
    const end = new Date(date.setHours(23,59,59));
    
    //const { records } = await RecordsRepo.findEveryRecordsHistoryInDateRange(begin, end);

    return [];
  }

  static async updateRecordLevel(identifier: string, change: string) {
    const { record } = await RecordsRepo.findOneRecord({_id: identifier});

    let level = Number(record.level);
    
    if (change === 'up')
      level += 1
    if (change === 'down')
      level -= 1

    await RecordsRepo.updateOneRecord({_id: identifier}, {level});
    //await RecordsRepo.insertOneHistoryOfRecord(identifier, change, level);
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
    
    await RecordsRepo.insertOneRecord({
      questline_id,
      title,
      description,
      metric,
      status: null,
      categories: categories ? categories : [],
      level: 0,
      history: [],
      xp: 50
    });
  }
}