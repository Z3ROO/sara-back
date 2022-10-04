import { RepositoryError, DatabaseError } from "../util/errors/RepositoryError";

interface IRepositoryResult {
  record?: any
  records?: any[]
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