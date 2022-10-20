import { RecordsRepo } from "../../repositories/leveling/RecordsRepo";
import { IRecords } from "../interfaces/interfaces";

export class Records {
  static async getAllRecords() {
    const { records } = await RecordsRepo.findAllRecords();

    return records
  }

  static async getRecordsHistoryOfOneDay(date: Date) {
    const beginning = date.toLocaleDateString('sv') + ' 00:00:00';
    const ending = date.toLocaleDateString('sv') + ' 23:59:59';
    const { records } = await RecordsRepo.findEveryRecordsHistoryInDateRange(beginning, ending);

    return records
  }

  static async updateRecordLevel(identifier: string, change: string) {
    const { record } = await RecordsRepo.findOneRecord(identifier);
    console.log(record)
    let level = Number(record.level);
    
    if (change === 'up')
      level += 1
    if (change === 'down')
      level -= 1

    await RecordsRepo.updateOneRecord(identifier, {level});
    await RecordsRepo.insertOneHistoryOfRecord(identifier, change, level);
  }

  static async createNewRecord(properties: IRecords) {
    properties = {
      ...properties,
      xp: properties.tier*50
    }
    await RecordsRepo.insertOneRecord(properties);
  }
}