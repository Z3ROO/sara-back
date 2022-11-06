import { ObjectId } from "mongodb";
import { INewFeat, INewQuest, IQuest } from "./../features/interfaces/interfaces";
import { RepositoryError } from "./../util/errors/RepositoryError";
import Repository, { NoSQLRepository } from "./RepoResultHandler";

class QuestRepo extends NoSQLRepository<IQuest>{
  async findActiveMainQuest() {
    const quest = await this.collection().findOne({type: 'main', state:'active'});
    return quest;
  }

  async findOneQuest(quest_id: string) {
    const quest = await this.collection().findOne({_id: new ObjectId(quest_id)});
    return quest;
  }

  async findActiveSideQuest() {
    const quest = await this.collection().find({type: 'side', state: 'active'}).toArray();
    return quest;
  }

  async findAllUnfineshedSideQuests() {
    const quests = await this.collection().find({type: 'side', state: {$ne:'finished'}}).toArray();
    return quests;
  }

  async findAllFinishedQuests() {
    const quests = await this.collection().find({$or: [ {state: 'finished'}, {state: 'invalidated'}]}).toArray();
    return quests;
  }

  async findAllFinishedMainQuests() {
    const quests = await this.collection().find({type: 'main', $or: [ {state: 'finished'}, {state: 'invalidated'}]}).toArray();
    return quests;
  }

  async findAllFinishedSideQuests() {
    const quests = await this.collection().find({type: 'side', state: 'finished'}).toArray();
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

  async insertOneQuest(properties: IQuest) {
    await this.collection().insertOne(properties);
  }

  async finishQuest(quest_id: string, focus_score: number) {
    await this.collection().findOneAndUpdate({_id: new ObjectId(quest_id)}, {$set: {
      finished_at: new Date(),
      focus_score,
      state: 'finished'
    }})
  }

  async insertDistractionPoint(quest_id: string) {
    await this.collection().findOneAndUpdate(
      {_id: new ObjectId(quest_id)}, 
      { $push: {distraction_score: new Date()} }
    );
  }

  async deleteQuest(quest_id: string) {
    await this.collection().findOneAndDelete({_id: new ObjectId(quest_id)});
  }

  async activateSideQuest(quest_id: string) {
    const activeSideQuest = await this.findActiveSideQuest();

    if (activeSideQuest)
      throw new RepositoryError('An active side quest already exists.')

    await this.collection().findOneAndUpdate(
      {_id: new ObjectId(quest_id)},
      {$set: { state: 'active' }}
    );
  }

  async questTodoStatus(quest_id: string, todoDescription: string) {
    const quest = await this.collection().findOne({_id: new ObjectId(quest_id)});
    const todo = quest.todos.find(todo => (todo.description === todoDescription));
    
    if (todo)
      return todo.state;
    
    return null;
  }
  
  async invalidateQuestTodo(quest_id: string, todoDescription: string,) {
    await this.collection().findOneAndUpdate({_id: new ObjectId(quest_id)}, {
      $set: {
        "todos.$[tds].state": 'invalidated',
        "todos.$[tds].finished_at": new Date()
      }
    },
    {
      arrayFilters: [ { "tds.description": todoDescription } ]
    });
  }

  async finishQuestTodo(quest_id: string, todoDescription: string,) {
    await this.collection().findOneAndUpdate({_id: new ObjectId(quest_id)}, {
      $set: {
        "todos.$[tds].state": 'finished',
        "todos.$[tds].finished_at": new Date()
      }
    },
    {
      arrayFilters: [ { "tds.description": todoDescription } ]
    });
  }
}

export default new QuestRepo('leveling', 'quests')
