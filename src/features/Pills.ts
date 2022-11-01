import { uniqueIdentifier } from "../repositories/FeatsRepo";
import PillsRepo from "../repositories/PillsRepo";
import { IPills } from "./interfaces/interfaces";
//Todo mundo tem de lidar com o mesmo.


//
//pills also has to pass though acceptance test

export class Pills {
  static async getAllPills(){
    const pills = await PillsRepo.findAllPills();

    return pills;
  }

  static async getOnePill(identifier: uniqueIdentifier) {
    const  pill = await PillsRepo.findOnePills(identifier);
    return pill;
  }

  static async createPill(properties: Partial<IPills>){
    await PillsRepo.insertOnePill(properties);
  }

  static async deletePill(identifier: uniqueIdentifier) {
    await PillsRepo.deleteOnePill(identifier);
  }
}