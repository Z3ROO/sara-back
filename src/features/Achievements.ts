import AchievementsRepo from "../repositories/leveling/AchievementsRepo"
import { BadRequest, InternalServerError } from "../util/errors/HttpStatusCode";
import { IAchievement } from "./interfaces/interfaces";

export default class AchievementsUsecase {
  static async getAllAchievements() {
    const {records} = await AchievementsRepo.findAllAchievements();
    return records;
  }

  static async getEveryCompleteAchievementOfOneDay(date: Date|string) {
    if (typeof date === 'string')
      date = new Date(date);
    const beginning = date.toLocaleDateString('sv') + ' 00:00:00';
    const ending = date.toLocaleDateString('sv') + ' 23:59:59';

    const { records } =  await AchievementsRepo.findAllAchievementsInDateRange(beginning, ending);

    return records;
  }

  static async getTitlesBoostUntilDate(date: Date|string): Promise<number> {
    if (typeof date === 'string')
      date = new Date(date);
    const untilDate = date.toLocaleDateString('sv');

    const { records } = await AchievementsRepo.findAllCompletedTitlesBeforeDate(untilDate);
    const boost = records.reduce((acc, val) => acc += val.boost, 0);

    return boost;
  }

  static async getOneAchievement(identifier: string) {
    const { record } = await AchievementsRepo.findOneAchievement(identifier)
    return record
  }

  static async isAchievementComplete(title: string): Promise<boolean> {
    const { record } = await AchievementsRepo.findOneAchievementByTitle(title)
    return record.complete
  }

  static async createNewAchievement(achievement: IAchievement) {
    const { title } = achievement;

    return AchievementsRepo.insertOneAchievement(achievement);
  }

  static async updateAchievement(identifier: string, properties: IAchievement) {
    for (let property in properties) {
      const validProperties = [
        'title',
        'description',
        'category',
        'icon',
        'img',
        'probability',
        'status'
      ]

      if (!validProperties.includes(property))
        throw new BadRequest();
    }

    return AchievementsRepo.updateAchievementProperties(identifier, properties);
  }

  static async deleteAchievement(identifier: string) {
    return AchievementsRepo.deleteOneAchievement(identifier);
  }  


  //Analisar se achievement ja existe na db
  //analisar se ja esta concluido, se estiver retornar para nao gastar processamento
  //analisar constraints para completar achiev
  //seguir para o proximo
}

class AchievementList {
  static Fearless() {
    //when i overcome what i consider all my fears
  }

  static ThisIsTheWay() {
    //when i am able to maintain the whole day in the practice at will
  }
}
