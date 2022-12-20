import { IDeeds, INewDeed, ITodo } from "../features/interfaces/interfaces";
import { RepositoryError } from "../util/errors/RepositoryError"
import { NoSQLRepository } from "./RepoResultHandler"
import { ObjectId } from 'mongodb'

const dbName = 'leveling';
const collectionName = 'deeds';

export type uniqueIdentifier = {title?: string, _id?: string}

class DeedsRepo extends NoSQLRepository<IDeeds>{
  async findAllDeeds() {
    const deeds = await this.collection().find().toArray();
    return deeds;
  }

  async findOneDeed(deed_id: string) {
    const _id = new ObjectId(deed_id);
    const deed = await this.collection().findOne({_id});
    return deed;
  }

  async findDeedsByCategory(categories: string[]) {
    const deeds = await this.collection().find({categories: {$all: categories}}).toArray();
    return deeds;
  }

  async findAllCompleteDeedsInDateRange(range: {begin: Date, end: Date}) {
    const { begin, end } = range;
    const deeds = await this.collection().find({finished_at: {$gte: begin, $lt: end}}).toArray();    
    return deeds;
  }

  async insertOneDeed(properties: IDeeds) {
    await this.collection().insertOne(properties);
  }

  async updateOneDeed(deed_id: string, properties: Partial<IDeeds>) {      
    const _id = new ObjectId(deed_id);
    await this.collection().findOneAndUpdate({_id}, {$set: properties});
  }
  
  async deleteOneDeed(deed_id: string) {
    const _id = new ObjectId(deed_id);
    await this.collection().findOneAndDelete({_id});
  }
}

export default new DeedsRepo(dbName, collectionName);
