import { isObjectId } from "../../infra/database/mongodb";
import PillsRepo from "../../repositories/leveling/PillsRepo";
import { BadRequest } from "../../util/errors/HttpStatusCode";
import { INewPill, IPills } from "../interfaces/interfaces";
//Todo mundo tem de lidar com o mesmo.

export default class Pills {
  static async getTakeablePills() {
    const pills = await PillsRepo.findAllTakeablePills();
    return pills;
  }

  static async getAllPills(){
    const pills = await PillsRepo.findAllPills();
    return pills;
  }

  static async getOnePill(pill_id: string) {
    if (!isObjectId(pill_id))
      throw new BadRequest('Invalid pill_id');

    const  pill = await PillsRepo.findOnePill(pill_id);
    return pill;
  }

  static async takePill(pill_id: string) {
    if (!isObjectId(pill_id))
      throw new BadRequest('Invalid pill_id');

    const _24h = (24*60*60*1000);
    const pill = await PillsRepo.findOnePill(pill_id);
    const daysPassedNextShot = Math.floor((pill.next_shot.getDate() - Date.now()) / (24*60*60*1000));
    
    let increment:number;
    if (daysPassedNextShot < 2)
      increment = 1;
    else if (daysPassedNextShot < 5)
      increment = 0;
    else if (daysPassedNextShot < 10)
      increment = -1;
    else
      increment = -2;
    
    let daysToNextShot:number;
    if (pill.times_taken < 7)
      daysToNextShot = _24h;
    else if (pill.times_taken < 15)
      daysToNextShot = _24h*7;
    else
      daysToNextShot = _24h*30;

    const today = new Date().setHours(0,0,0);

    const next_shot = new Date(today + daysToNextShot);

    await PillsRepo.updatePill(pill_id, next_shot, increment);
  }

  static async addNewPill(properties: INewPill){
    const {
      name,
      description
    } = properties;

    const pills = await this.getAllPills();
    if (pills.find(pill => pill.name === name))
      throw new BadRequest('A pill with this name already exists')

    await PillsRepo.insertOnePill({
      name,
      description,
      times_taken: 0,
      next_shot: new Date(),
      history: []
    });
  }

  static async deletePill(pill_id: string) {
    const pills = await Pills.getOnePill(pill_id);
    
    if (pills.times_taken < 3)
      throw new BadRequest('Pills must be taken at least 3 times to be deleted');

    await PillsRepo.deleteOnePill(pill_id);
  }
}