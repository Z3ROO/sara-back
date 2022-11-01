import { NoSQLRepository } from "./RepoResultHandler"
import { RepositoryError } from "../util/errors/RepositoryError";
import { IQuestline } from "../features/interfaces/interfaces";
import { ObjectId } from "mongodb";

class QuestlineRepo extends NoSQLRepository<IQuestline>{
  async findMainQuestline(){
    const questline = await this.collection().findOne({type: 'main', state: 'active'});
    return questline;
  }
  
  async findAllActiveQuestlines(){
    const questlines = await this.collection().find({state: 'active'}).toArray();
    return questlines;
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

  async createNewQuestline(questProperties: Partial<IQuestline>) {
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
      const mainQuestline = await this.findMainQuestline();

      if (mainQuestline)
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

  async finishMainQuestline() {
    const result = await this.collection().updateOne({type: 'main', state: 'active'}, {$set: {finished_at: new Date(), state:'finished'}});
    
    return result.modifiedCount > 0
  }
  
  async invalidateQuestline(identifier: string) {
    await this.collection().updateOne({_id: new ObjectId(identifier)}, {$set: {finished_at: new Date(), state:'invalidated'}});
  }

  async deleteQuestline(identifier: string) {
    await this.collection().deleteOne({_id: new ObjectId(identifier)});
  }
}

export default new QuestlineRepo('leveling', 'questlines');