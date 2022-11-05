import { IFeats, INewFeat, ITodo } from "./../features/interfaces/interfaces";
import { RepositoryError } from "./../util/errors/RepositoryError"
import { NoSQLRepository } from "./RepoResultHandler"
import { ObjectId } from 'mongodb'

const dbName = 'leveling';
const collectionName = 'feats';

export type uniqueIdentifier = {title?: string, _id?: string}

class FeatsRepo extends NoSQLRepository<IFeats>{
  async findAllFeats() {
    const feats = await this.collection().find().toArray();
    return feats;
  }

  async findOneFeat(feat_id: string) {
    const _id = new ObjectId(feat_id);
    const feat = await this.collection().findOne({_id});
    return feat;
  }

  async findFeatsByCategory(categories: string[]) {
    const feats = await this.collection().find({categories: {$all: categories}}).toArray();
    return feats;
  }

  async findFeatsByQuestline(questline_id: string) {
    const feats = await this.collection().find({questline_id}).toArray();
    return feats;
  }

  async findAllCompleteFeatsInDateRange(range: {begin: Date, end: Date}) {
    const { begin, end } = range;
    const feats = await this.collection().find({finished_at: {$gte: begin, $lt: end}}).toArray();    
    return feats;
  }

  async insertOneFeat(properties: IFeats) {
    await this.collection().insertOne(properties);
  }

  async updateOneFeat(feat_id: string, properties: Partial<IFeats>) {
    const invalidProperty = Object.keys(properties).find( prop => !['skill_id', 'questline_id', 'title', 'description','tier', 'completed', 'xp', 'finished_at'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);
      
    const _id = new ObjectId(feat_id);
    await this.collection().findOneAndUpdate({_id}, {$set: properties});
  }
  
  async deleteOneFeat(feat_id: string) {
    const _id = new ObjectId(feat_id);
    await this.collection().findOneAndDelete({_id});
  }

  async proceedAcceptanceLevel(feat_id: string, stage: 'reviewed'|'ready') {
    const _id = new ObjectId(feat_id);
    await this.collection().findOneAndUpdate({_id}, {
      $set:{"acceptance.stage": stage},
      $push: {"acceptance.date": new Date()}
    });
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
