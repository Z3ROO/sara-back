import { uniqueIdentifier } from "../repositories/FeatsRepo";
import PillsRepo from "../repositories/PillsRepo";
import { INewPill, IPills } from "./interfaces/interfaces";
//Todo mundo tem de lidar com o mesmo.


//
//pills also has to pass though acceptance test

export default class Pills {
  static async getTodaysPills() {
    const pills = await PillsRepo.findAllTakeablePills();

    return pills;
  }

  static async getAllPills(){
    const pills = await PillsRepo.findAllPills();

    return pills;
  }

  static async getOnePill(identifier: uniqueIdentifier) {
    const  pill = await PillsRepo.findOnePill(identifier);
    return pill;
  }

  static async takePill(identifier: string) {
    //const pill = await PillsRepo.findOnePill({_id: identifier});
    const today = new Date().setHours(0,0,0);
    const next_shot = new Date(today + (24*60*60*1000));

    await PillsRepo.updatePill({_id: identifier}, next_shot);
  }

  static async addNewPill(properties: INewPill){
    await PillsRepo.insertOnePill(properties);
  }

  static async deletePill(identifier: uniqueIdentifier) {
    await PillsRepo.deleteOnePill(identifier);
  }
}