import { NoSQLRepository } from "./RepoResultHandler"
import { INewQuestline, IQuestline } from "../features/interfaces/interfaces";
import { ObjectId } from "mongodb";
import { BadRequest } from "../util/errors/HttpStatusCode";

class QuestlineRepo extends NoSQLRepository<IQuestline>{
  
  async findActiveQuestline(){
    const questline = await this.collection().findOne({state: 'active'});
    return questline;
  }

  async findAllFinishedQuestlines(){
    const questlines = await this.collection().find({state: 'finished'}).toArray();
    return questlines;
  }
  
  async findOneQuestline(identifier: string) {
    const questline = await this.collection().findOne({_id: new ObjectId(identifier)});

    return questline;
  }

  async findFineshedQuestlineInDateRange(range: {begin: Date, end: Date}) {
    const  { begin, end } = range;
    const questlines = await this.collection().find({finished_at: {$gte: begin, $lt: end}}).toArray();
    return questlines;
  }

  async createNewQuestline(questProperties: INewQuestline) {
    const { 
      title,
      description,
      timecap
    } = questProperties;
    
    const mainQuestline = await this.findActiveQuestline();

    if (mainQuestline)
      throw new BadRequest('An active main questline already exist');

    this.collection().insertOne({
      title,
      description,
      state: 'active',
      timecap: timecap,
      created_at: new Date(),
      finished_at: null,
      xp: null
    });
  }

  async terminateActiveQuestline(action: 'finished'|'invalidated') {
    const result = await this.collection().updateOne({state: 'active'}, {$set: {finished_at: new Date(), state:action}});
    
    return result.modifiedCount > 0
  }

  async deleteQuestline(identifier: string) {
    await this.collection().deleteOne({_id: new ObjectId(identifier)});
  }
}

export default new QuestlineRepo('leveling', 'questlines');