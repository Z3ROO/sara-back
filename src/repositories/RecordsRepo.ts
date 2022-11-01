import { IRecords } from "./../features/interfaces/interfaces";
import { RepositoryError } from "./../util/errors/RepositoryError";
import { NoSQLRepository } from "./RepoResultHandler";
import { buildSearchString, uniqueIdentifier } from "./FeatsRepo";


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

  async findRecordsByQuestline(questline: string) {
    const records = await this.collection().find({
      questline_id: questline
    }).toArray();

    return records
  }

  async findOneRecord(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);
    const record = await this.collection().findOne(searchParams);

    return record;
  }

  async findEveryRecordsHistoryInDateRange(range: {begin: Date, end: Date}) {
    const { begin, end } = range;
    const records = await this.collection().find({"history.date": { $gte: begin, $lt: end }}).toArray();

    return records;
  }

  async insertOneRecord(properties: Partial<IRecords>) {
    const {
      questline_id,
      title,
      description,
      acceptance,
      metric,
      status,
      categories,
      level,
      history,
      xp
    } = properties;

    await this.collection().insertOne({
      questline_id,
      title,
      description,
      acceptance: {
        stage: 'created',
        date: [new Date()]
      },
      metric,
      status: {
        waitTime: status.waitTime,
        stageAmount: status.stageAmount,
        stage: null,
        last_commitment: null
      },
      categories: categories ? categories : [],
      level: 0,
      history: [],
      xp: 50
    });
  }

  async updateOneRecord(identifier: uniqueIdentifier, properties: Partial<IRecords>) {
    const invalidProperty = Object.keys(properties).find( prop => !['questline_id', 'title', 'description', 'qtd', 'categories', 'tier', 'level', 'xp'].includes(prop))
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

  async updateRecordLevel(identifier: uniqueIdentifier, direction: -1|0|1) {
    const searchParams = buildSearchString(identifier);
    await this.collection().findOneAndUpdate(searchParams, {
      $push: {
        history: {
          direction: direction,
          date: new Date()
        }
      }
    });
  }
  
  async deleteOneRecord(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);
    await this.collection().findOneAndDelete(searchParams);
  }

}

export default new RecordsRepo('leveling', 'records');
