import { ObjectId } from "mongodb";
import { INewFeat, INewQuest, IQuest } from "../../features/interfaces/interfaces";
import Repository, { NoSQLRepository } from "../RepoResultHandler";

class QuestRepo extends NoSQLRepository<IQuest>{
  async findActiveQuest() {
    const quest = await this.collection().findOne({state:'active'});
    return quest;
  }

  async findOneQuest(quest_id: string) {
    const quest = await this.collection().findOne({_id: new ObjectId(quest_id)});
    return quest;
  }

  async findAllFinishedQuests() {
    const quests = await this.collection().find({$or: [ {state: 'finished'}, {state: 'invalidated'}]}).toArray();
    return quests;
  }

  async findAllFinishedQuestsInDateRange(range: {begin: Date, end: Date}) {
    const { begin, end } = range;
    const quests = await this.collection().find({
      $or: [{state: 'finished'}, {state: 'invalidated'}],
      finished_at: { $gte: begin,  $lt: end}
    }).toArray();

    return quests;
  }

  async insertDistractionPoint(quest_id: string) {
    await this.collection().findOneAndUpdate(
      {_id: new ObjectId(quest_id)}, 
      { $push: {distraction_score: new Date()} }
    );
  }

  async insertOneQuest(properties: IQuest) {
    await this.collection().insertOne(properties);
  }

  async terminateQuest(focus_score: number, state: 'finished'|'invalidated') {
    await this.collection().findOneAndUpdate({state: 'active'}, {$set: {
      finished_at: new Date(),
      focus_score,
      state
    }})
  }

  async deleteQuest(quest_id: string) {
    await this.collection().findOneAndDelete({_id: new ObjectId(quest_id)});
  }

  async handleQuestTodo(quest_id: string, todoDescription: string, state: 'finished'|'invalidated') {
    await this.collection().findOneAndUpdate({_id: new ObjectId(quest_id)}, {
      $set: {
        "todos.$[tds].state": state,
        "todos.$[tds].finished_at": new Date()
      }
    },
    {
      arrayFilters: [ { "tds.description": todoDescription } ]
    });
  }
}

export default new QuestRepo('leveling', 'quests')
