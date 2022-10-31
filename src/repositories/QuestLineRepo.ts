import { NoSQLRepository } from "./RepoResultHandler"
import { RepositoryError } from "./../util/errors/RepositoryError";
import { IQuestLine } from "./../features/interfaces/interfaces";
import { ObjectId } from "mongodb";
import { BadRequest } from "../util/errors/HttpStatusCode";

class QuestLineRepo extends NoSQLRepository<IQuestLine>{
  async findMainQuestLine(){
    const record = await this.collection().findOne({type: 'main', state: 'active'});
    return { record };
  }
  
  async findAllActiveQuestLines(){
    const records = await this.collection().find({state: 'active'}).toArray();
    return { records };
  }

  async findAllFinishedQuestLines(){
    const records = await this.collection().find({state: 'finished'}).toArray();
    return { records };
  }
  
  async findOneQuestLine(identifier: string) {
    const record = await this.collection().findOne({_id: new ObjectId(identifier)});

    return { record };
  }

  async findFineshedQuestLineInDateRange(range: {begin: Date, end: Date}) {
    const  { begin, end } = range;
    const records = await this.collection().find({finished_at: {$gte: begin, $lt: end}}).toArray();
    return { records };
  }

  async createNewQuestLine(questProperties: Partial<IQuestLine>) {
    const { 
      title,
      description,
      type,
      state,
      timecap,
      created_at,
      finished_at,
      level,
      history,
      xp
    } = questProperties;
    
    const isTypeValid = ['main', 'practice'].includes(type);

    if (!isTypeValid)
      throw new RepositoryError('An invalid questline_type was issued');
    
    if (type === 'main') {
      const mainQuestline = await this.findMainQuestLine();

      if (mainQuestline.record)
        throw new Error('Main questline already exist');
    }

    this.collection().insertOne({
      title,
      description,
      type,
      state: 'active',
      timecap: type === 'main' ? timecap : null,
      created_at: new Date(),
      finished_at: null,
      level: type === 'main' ? null : 0,
      history: type === 'main' ? null : [],
      xp: type === 'main' ? 1000 : null
    });
  }

  async finishMainQuestLine() {
    const result = await this.collection().updateOne({type: 'main', state: 'active'}, {$set: {finished_at: new Date(), state:'finished'}});
    
    return result.modifiedCount > 0
  }
  
  async invalidateQuestLine(identifier: string) {
    await this.collection().updateOne({_id: new ObjectId(identifier)}, {$set: {finished_at: new Date(), state:'invalidated'}});
  }

  async deleteQuestline(identifier: string) {
    await this.collection().deleteOne({_id: new ObjectId(identifier)});
  }
}

export default new QuestLineRepo('leveling', 'questlines');