import { randomUUID } from "crypto"
import { ObjectId } from "mongodb";
import { IQuest } from "../../features/interfaces/interfaces";
import { handleTransaction, queryDatabase } from "../../infra/database/postgresql"
import { RepositoryError } from "../../util/errors/RepositoryError"
import Repository, { NoSQLRepository } from "../RepoResultHandler"

class QuestRepo extends NoSQLRepository<IQuest>{
  async findMainQuest() {
    const record = await this.collection().findOne({type: 'main', state:'active'});
    return { record };
  }

  async findOneQuest(identifier: string) {
    const record = await this.collection().findOne({_id: new ObjectId(identifier)});
    return { record };
  }

  async findActiveSideQuest() {
    const record = await this.collection().find({type: 'side', state: 'active'}).toArray();
    return { record };
  }

  async findAllUnfineshedSideQuests() {
    const records = await this.collection().find({type: 'side', state: {$ne:'finished'}}).toArray();
    return { records };
  }

  async findAllFinishedQuests() {
    const records = await this.collection().find({$or: [ {state: 'finished'}, {state: 'invalidated'}]}).toArray();
    return { records };
  }

  async findAllFinishedMainQuests() {
    const records = await this.collection().find({type: 'main', state: 'finished'}).toArray();
    return { records };
  }

  async findAllFinishedSideQuests() {
    const records = await this.collection().find({type: 'side', state: 'finished'}).toArray();
    return { records };
  }

  async findAllFinishedQuestsInDateRange(range: {begin: Date, end: Date}) {
    const { begin, end } = range;
    const records = await this.collection().find({
      $or: [{state: 'finished'}, {state: 'invalidated'}],
      finished_at: { $gte: begin,  $lt: end}
    }).toArray();

    return { records };
  }

  async insertNewQuest(properties: Partial<IQuest>) {
    const { 
      questline_id,
      mission_id,
      title,
      description,
      type,
      todos,
      timecap,
      xp
    } = properties;

    if (type === 'main') {
      const mainQuest = await this.findMainQuest();

      if (mainQuest.record)
        throw new RepositoryError('An active main quest already exist.');
    }
    else if (type === 'side'){
      const sideQuests = await this.findAllUnfineshedSideQuests();

      if (sideQuests.records.length >= 5)
        throw new RepositoryError('Maximun amount of side quests pre-registered reached.');
    }

    await this.collection().insertOne({
      questline_id,
      mission_id: mission_id ? mission_id : null,
      title,
      description,
      type,
      state: type === 'main' ? 'active' : 'deferred',
      todos,
      timecap,
      focus_score: 0,
      distraction_score: 0,
      created_at: new Date(),
      finished_at: null,
      xp
    });
  }

  async finishQuest(identifier: string, focus_score: number) {
    await this.collection().findOneAndUpdate({_id: new ObjectId(identifier)}, {$set: {
      finished_at: new Date(),
      focus_score,
      state: 'finished'
    }})
  }

  async insertDistractionPoint(identifier: string) {
    await this.collection().findOneAndUpdate(
      {_id: new ObjectId(identifier)}, 
      { $inc: {distraction_score: 1}}
    );
  }

  async deleteQuest(identifier: string) {
    await this.collection().findOneAndDelete({_id: new ObjectId(identifier)});
  }

  async activateSideQuest(identifier: string) {
    const activeSideQuest = await this.findActiveSideQuest();

    if (activeSideQuest.record)
      throw new RepositoryError('An active side quest already exists.')

    await this.collection().findOneAndUpdate(
      {_id: new ObjectId(identifier)},
      {$set: { state: 'active' }}
      );
  }

  async invalidateQuestTodo(questIdentifier: string, todoIdentifier: string,) {
    await this.collection().findOneAndUpdate({_id: new ObjectId(questIdentifier)}, {
      $set: {
        "todos.$[tds].state": 'invalidated',
        "todos.$[tds].finished_at": new Date()
      }
    },
    {
      arrayFilters: [ { "tds.description": todoIdentifier } ]
    })
  }

  async finishQuestTodo(questIdentifier: string, todoIdentifier: string,) {
    await this.collection().findOneAndUpdate({_id: new ObjectId(questIdentifier)}, {
      $set: {
        "todos.$[tds].state": 'finished',
        "todos.$[tds].finished_at": new Date()
      }
    },
    {
      arrayFilters: [ { "tds.description": todoIdentifier } ]
    })
  }
}



export default new QuestRepo('leveling', 'quests')
