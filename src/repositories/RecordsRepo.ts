import { INewRecord, IRecords, RecordsActions } from "./../features/interfaces/interfaces";
import { RepositoryError } from "./../util/errors/RepositoryError";
import { NoSQLRepository } from "./RepoResultHandler";
import { buildSearchString, uniqueIdentifier } from "./FeatsRepo";
import { ObjectID } from "bson";

const dbName = 'leveling';
const collectionName = 'records';

class RecordsRepo extends NoSQLRepository<IRecords>{
  async findAllRecords() {
    const records = await this.collection().find().toArray();
    return records
  }

  async findRecordsByCategory(categories: string[]) {
    const records = await this.collection().find({
      categories: {$all: categories}
    }).toArray();

    return records
  }

  async findRecordsByQuestline(questline_id: string) {
    const records = await this.collection().find({questline_id}).toArray();
    return records
  }

  async findOneRecord(record_id: string) {
    const _id = new ObjectID(record_id);
    const record = await this.collection().findOne({_id});
    return record;
  }

  async findEveryRecordsHistoryInDateRange(range: {begin: Date, end: Date}) {
    const { begin, end } = range;
    const records = await this.collection().find({"history.date": { $gte: begin, $lt: end }}).toArray();

    return records;
  }

  async insertOneRecord(properties: IRecords) {
    await this.collection().insertOne(properties);
  }

  async updateOneRecord(record_id: string, properties: Partial<IRecords>) {
    const invalidProperty = Object.keys(properties).find( prop => !['skill_id', 'questline_id', 'title', 'description', 'metric', 'level', 'xp'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);

    const _id = new ObjectID(record_id);
    await this.collection().findOneAndUpdate({_id}, {$set: properties});
  }

  async updateRecordLevel(record_id: string, action: RecordsActions, progress: number) {
    const _id = new ObjectID(record_id);
    await this.collection().findOneAndUpdate({_id}, {
      $inc: {
        [`groups.${action}.current`]: progress
      },
      $push: {
        [`groups.${action}.history`]: {
          progress,
          date: new Date()
        }
      }
    });
  }
  
  async deleteOneRecord(record_id: string) {
    const _id = new ObjectID(record_id);
    await this.collection().findOneAndDelete({_id});
  }
}

export default new RecordsRepo(dbName, collectionName);
