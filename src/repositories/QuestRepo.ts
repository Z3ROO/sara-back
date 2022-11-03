import { ObjectId } from "mongodb";
import { INewFeat, INewQuest, IQuest } from "./../features/interfaces/interfaces";
import { RepositoryError } from "./../util/errors/RepositoryError"
import Repository, { NoSQLRepository } from "./RepoResultHandler"

class QuestRepo extends NoSQLRepository<IQuest>{
  async findActiveMainQuest() {
    const quest = await this.collection().findOne({type: 'main', state:'active'});
    return quest;
  }

  async findOneQuest(identifier: string) {
    const quest = await this.collection().findOne({_id: new ObjectId(identifier)});
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
    const quests = await this.collection().find({type: 'main', state: 'finished'}).toArray();
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

  async insertNewQuest(properties: INewQuest) {
    const { 
      questline_id,
      skill_id,
      mission_id,
      title,
      description,
      type,
      todos,
      timecap
    } = properties;

    if (type === 'main') {
      const mainQuest = await this.findActiveMainQuest();

      if (mainQuest)
        throw new RepositoryError('An active main quest already exist.');
    }
    else if (type === 'side'){
      const sideQuests = await this.findAllUnfineshedSideQuests();

      if (sideQuests.length >= 5)
        throw new RepositoryError('Maximun amount of side quests pre-registered reached.');
    }

    await this.collection().insertOne({
      questline_id: questline_id ? questline_id : null,
      skill_id: skill_id ? skill_id : null,
      mission_id: mission_id ? mission_id : null,
      title,
      description,
      type,
      state: ['main','practice'].includes(type) ? 'active' : 'deferred',
      todos: todos.map((todo: string) => ({description: todo, state: 'active', finished_at: null})),
      timecap,
      focus_score: 0,
      distraction_score: [],
      created_at: new Date(),
      finished_at: null,
      xp: null
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
      { $push: {distraction_score: new Date()} }
    );
  }

  async deleteQuest(identifier: string) {
    await this.collection().findOneAndDelete({_id: new ObjectId(identifier)});
  }

  async activateSideQuest(identifier: string) {
    const activeSideQuest = await this.findActiveSideQuest();

    if (activeSideQuest)
      throw new RepositoryError('An active side quest already exists.')

    await this.collection().findOneAndUpdate(
      {_id: new ObjectId(identifier)},
      {$set: { state: 'active' }}
      );
  }

  async questTodoStatus(questIdentifier: string, todoIdentifier: string) {
    const quest = await this.collection().findOne({_id: new ObjectId(questIdentifier)});
    const todo = quest.todos.find(todo => (todo.description === todoIdentifier))
    
    if (todo)
      return todo.state;
    
    return null;
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
    });
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
    });
  }
}



export default new QuestRepo('leveling', 'quests')
