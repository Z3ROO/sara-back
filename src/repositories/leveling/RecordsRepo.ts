import { ObjectId } from "mongodb";
import { IRecords } from "../../features/interfaces/interfaces";
import { RepositoryError } from "../../util/errors/RepositoryError";
import { NoSQLRepository } from "../RepoResultHandler";
import { uniqueIdentifier } from "./FeatsRepo";


class RecordsRepo extends NoSQLRepository<IRecords>{
  async findAllRecords() {
    const records = await this.collection().find().toArray();

    return { records }
  }

  async findOneRecord(identifier: uniqueIdentifier) {
    const searchParams = this.searchParams(identifier);
    const record = await this.collection().findOne(searchParams);

    return { record };
  }

  async insertOneRecord(properties: IRecords) {
    await this.collection().insertOne(properties);
  }

  async updateOneRecord(identifier: uniqueIdentifier, properties: Partial<IRecords>) {
    const invalidProperty = Object.keys(properties).find( prop => !['questline_id', 'title', 'description', 'qtd', 'categories', 'tier', 'level', 'xp'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);

    const searchParams = this.searchParams(identifier);

    await this.collection().findOneAndUpdate(searchParams, {$set: properties});
  }
  
  async deleteOneRecord(identifier: uniqueIdentifier) {
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

export default new RecordsRepo('leveling', 'records');
