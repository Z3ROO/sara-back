import { IFeats } from "./../features/interfaces/interfaces";
import { RepositoryError } from "./../util/errors/RepositoryError"
import { NoSQLRepository } from "./RepoResultHandler"
import { ObjectId } from 'mongodb'

const dbName = 'leveling';
const collectionName = 'feats';

export type uniqueIdentifier = {title?: string, _id?: string}

class FeatsRepo extends NoSQLRepository<IFeats>{
  async findAllFeats() {
    const records = await this.collection().find().toArray();
    return { records };
  }

  async findOneFeat(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);

    const record = await this.collection().findOne(searchParams);
    return { record };
  }

  async findFeatsByCategory(categories: string[]) {
    const records = await this.collection().find({categories: {$all: categories}}).toArray();

    return { records };
  }

  async findFeatsByQuestline(questline: string) {
    const records = await this.collection().find({questline_id: questline}).toArray();

    return { records };
  }

  async findAllCompleteFeatsInDateRange(range: {begin: Date, end: Date}) {
    const { begin, end } = range;
    const records = await this.collection().find({finished_at: {$gte: begin, $lt: end}}).toArray();
    
    return { records };
  }

  async insertOneFeat(properties: Partial<IFeats>) {
    const {
      questline_id,
      title,
      description,
      acceptance,
      todos,
      categories,
      tier,
      completed,
      xp,
      finished_at,
    } = properties;
    
    await this.collection().insertOne({
      questline_id,
      title,
      description,
      acceptance: {
        stage: 'created',
        date: [new Date()]
      },
      todos: todos ? todos : null,
      categories,
      tier,
      completed: false,
      xp: tier*50,
      finished_at: null
    })
  }

  async updateOneFeat(identifier: uniqueIdentifier, properties: Partial<IFeats>) {
    const invalidProperty = Object.keys(properties).find( prop => !['questline_id', 'title', 'description','categories','tier', 'completed', 'xp', 'finished_at'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);
      
    const searchParams = buildSearchString(identifier);

    await this.collection().findOneAndUpdate(searchParams, {$set: properties});
  }

  async proceedAcceptanceLevel(identifier: uniqueIdentifier, stage: 'reviewed'|'ready') {
    const searchParams = buildSearchString(identifier);
    await this.collection().findOneAndUpdate(searchParams, {
      $set:{"acceptance.stage":stage},
      $push: {"acceptance.date": new Date()}
    });
  }

  async deleteOneFeat(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);    
    await this.collection().findOneAndDelete(searchParams);
  }

}

export function buildSearchString(identifier: uniqueIdentifier) {
  let result:{title: string}|{_id: ObjectId};
  const { title, _id } = identifier;

  if (title)
    result = {title};
  else if(_id)
    result = {_id: new ObjectId(_id)};
  else
    throw new Error('An identifier must be specified.');

  return result;
}
export default new FeatsRepo(dbName, collectionName);