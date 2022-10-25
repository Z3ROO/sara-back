import { uniqueIdentifier } from "../repositories/FeatsRepo";
import PillsRepo from "../repositories/PillsRepo";
import { IPills } from "./interfaces/interfaces";
//Todo mundo tem de lidar com o mesmo.

export class Pills {
  static async getAllPills(){
    const { records } = await PillsRepo.findAllPills();

    return records;
  }

  static async getOnePill(identifier: uniqueIdentifier) {
    const  { record } = await PillsRepo.findOnePills(identifier)
    return record;
  }

  static async createPill(properties: Partial<IPills>){
    await PillsRepo.insertOnePill(properties)
  }

  static async deletePill(identifier: uniqueIdentifier) {
    await PillsRepo.deleteOnePill(identifier);
  }
}