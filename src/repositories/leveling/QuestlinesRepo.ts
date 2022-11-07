import { NoSQLRepository } from "../RepoResultHandler"
import { IQuestline } from "../../features/interfaces/interfaces";
import { ObjectId } from "mongodb";
import { BadRequest } from "../../util/errors/HttpStatusCode";

class QuestlineRepo extends NoSQLRepository<IQuestline>{

  async findActiveQuestline(){
    const questline = await this.collection().findOne({state: 'active'});
    return questline;
  }

  async findAllQuestlines(){
    const questlines = await this.collection().find().sort({created_at: -1}).toArray();
    return questlines;
  }

  async findAllFinishedQuestlines(){
    const questlines = await this.collection().find({state: 'finished'}).sort({created_at: -1}).toArray();
    return questlines;
  }
  
  async findOneQuestline(questline_id: string) {
    const questline = await this.collection().findOne({_id: new ObjectId(questline_id)});
    return questline;
  }

  async findFineshedQuestlinesInDateRange(range: {begin: Date, end: Date}) {
    const  { begin, end } = range;
    const questlines = await this.collection().find({finished_at: {$gte: begin, $lt: end}}).toArray();
    return questlines;
  }

  async insertOneQuestline(properties: IQuestline) {
    await this.collection().insertOne(properties);
  }

  async terminateActiveQuestline(action: 'finished'|'invalidated') {
    const result = await this.collection().updateOne({state: 'active'}, {$set: {finished_at: new Date(), state:action}});
    return result.modifiedCount > 0
  }

  async deleteQuestline(questline_id: string) {
    await this.collection().deleteOne({_id: new ObjectId(questline_id)});
  }
}

export default new QuestlineRepo('leveling', 'questlines');