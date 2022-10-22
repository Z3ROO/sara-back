import { IFeats } from "../../features/interfaces/interfaces";
import { RepositoryError } from "../../util/errors/RepositoryError"
import { NoSQLRepository } from "../RepoResultHandler"
import { ObjectId } from 'mongodb'

const dbName = 'leveling';
const collectionName = 'feats';

type uniqueIdentifier = {title?: string, _id?: string}

class FeatsRepo extends NoSQLRepository<IFeats>{
  async findAllFeats() {
    const records = await this.collection().find().toArray();
    return { records };
  }

  async findOneFeat(identifier: uniqueIdentifier) {
    const searchParams = this.searchParams(identifier);

    const record = await this.collection().findOne(searchParams);
    return { record };
  }

  async findAllCompleteFeatsInDateRange(range: {begin: string, end: string}) {
    const { begin, end } = range;
    const records = await this.collection().find({finished_at: {$gte: new Date(begin), $lt: new Date(end)}}).toArray()
    
    return {records};
  }

  async insertOneFeat(properties: IFeats) {
    const {
      questline_id,
      title,
      description,
      categories,
      tier,
      completed,
      xp,
      finished_at
    } = properties;
    
    await this.collection().insertOne({
      questline_id,
      title,
      description,
      categories,
      tier,
      completed,
      xp,
      finished_at: null
    })
  }

  async updateOneFeat(identifier: uniqueIdentifier, properties: Partial<IFeats>) {
    const invalidProperty = Object.keys(properties).find( prop => !['questline_id', 'title', 'description','categories','tier', 'completed', 'xp', 'finished_at'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);
      
    const searchParams = this.searchParams(identifier);

    await this.collection().findOneAndUpdate(searchParams, {$set: properties});
  }

  async deleteOneFeat(identifier: uniqueIdentifier) {
    const searchParams = this.searchParams(identifier);    
    await this.collection().findOneAndDelete(searchParams);
  }

  private searchParams(identifier: uniqueIdentifier) {
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
}

export default new FeatsRepo(dbName, collectionName);
