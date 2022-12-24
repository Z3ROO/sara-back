import { INewRecord, IRecords } from "./../features/interfaces/interfaces";
import { RepositoryError } from "./../util/errors/RepositoryError";
import { NoSQLRepository } from "./RepoResultHandler";
import { buildSearchString, uniqueIdentifier } from "./FeatsRepo";
import { ObjectId, ObjectID } from "bson";

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

  async updateRecordLevel(record_id: string, progress_increase: number, quest_progress: number, next_shot: Date, max_level = false) {
    const _id = new ObjectID(record_id);
    await this.collection().findOneAndUpdate({_id}, {
      $set: {
        progress: progress_increase,
        ['engageable.not_before']: next_shot,
        complete: max_level
      },
      $push: {
        history: {
          progress: quest_progress,
          date: new Date()
        }
      }
    });
  }

  async requirementsToComplete(requirementsOrRecord: string[]|string) {
    let requirements: string[];
    if (typeof requirementsOrRecord === 'string') {
      const record_id = requirementsOrRecord
      const record = await this.collection().findOne({_id: new ObjectId(record_id)});
      requirements = record.engageable.requirements;
    }
    else
      requirements = requirementsOrRecord;

    const _ids = requirements.map(req => new ObjectId(req));
    const records = await this.collection().find({_id: { $in: _ids }, level: {$gte: 1}}).toArray();
    
    if (records.length === 0)
      return null

    return records;
  }
  
  async deleteOneRecord(record_id: string) {
    const _id = new ObjectID(record_id);
    await this.collection().findOneAndDelete({_id});
  }
}

export default new RecordsRepo(dbName, collectionName);
