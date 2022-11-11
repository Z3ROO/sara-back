import { db } from "../infra/database/mongodb";
import { RepositoryError, DatabaseError } from "../util/errors/RepositoryError";
import { Collection } from 'mongodb';
import { BadRequest } from "../util/errors/HttpStatusCode";

interface IRepositoryResult {
  record?: any
  records?: any[]
}

export class NoSQLRepository<Document> {
  protected dbName:string;
  protected collectionName:string;
  protected collection:() => Collection<Document>;

  constructor(dbName:string, collectionName: string) {
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.collection = () => db(this.dbName).collection(this.collectionName);
  }

  async wipeCollection() {
    if (process.env.NODE_ENV !== 'dev')
      throw new BadRequest('Can only wipe collections on development mode')

    await this.collection().deleteMany({});
  }
}

export default class Repository {
  
  protected static async RepoResultHandler(callback:(()=> any)) {

    try {      
      const { rows, rowCount } = await callback();

      let result: IRepositoryResult = {
        records: rows
      };

      if (rowCount === 1) result.record = rows[0];

      return result;
    }
    catch(err) {  
      if (err.code === '23505')
        throw new RepositoryError('An achievement with this title already exists.');

      throw new DatabaseError(err.message);
    }
  }

  protected static mountPropertiesNamesToUpdate<I>(properties: I, startPosition: number): string {
    const propertiesNamesReduced = Object.keys(properties).reduce((acc, val, index) => {
      const firstItemWithNoComma = (`${val} = $${index+startPosition}`);
      const followingItemsWithComma = (`${acc} , ${val} = $${index+startPosition}`);

      return index === 0 ? firstItemWithNoComma : followingItemsWithComma;
    }, '');

    return propertiesNamesReduced;
  }

  public static currentDate() {
    return new Date().toLocaleString('sv')+'-3';
  }
}