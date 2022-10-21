import { randomUUID } from "crypto"
import { IFeats } from "../../features/interfaces/interfaces";
import { queryDatabase } from "../../infra/database/postgresql"
import { RepositoryError } from "../../util/errors/RepositoryError"
import Repository, { NoSQLRepository } from "../RepoResultHandler"
import mongodb from 'mongodb'

const dbName = 'leveling';
const collectionName = 'feats';

class FeatsRepoo extends NoSQLRepository<IFeats>{
  async findAllFeats() {
    const records = await this.collection().find().toArray()
    return { records };
    //return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM feats;`));
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
    
    const response = await this.collection().insertOne({
      questline_id,
      title,
      description,
      categories,
      tier,
      completed,
      xp,
      finished_at
    })

    this.findAllFeats();
    //console.log(response)
  }
}

export class FeatsRepo extends Repository{

  static async findAllFeats() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM feats;`));
  }

  static async findOneFeat(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM feats WHERE id = $1;`, [identifier]));
  }

  static async findOneFeatByTitle(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM feats WHERE title = $1;`, [identifier]));
  }
   
  static async findAllCompleteFeatsInDateRange(begin: string, end: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM feats WHERE completed = true AND finished_at >= $1 AND finished_at <= $2;`,[begin, end]));
  }

  static async insertOneFeat(properties: IFeats) {

    const queryString = `
      INSERT INTO feats (id, questline_id, title, description, categories, tier, xp)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    const queryParameters = [
      randomUUID(),
      properties.questline_id,
      properties.title,
      properties.description,
      properties.categories,
      properties.tier,
      properties.xp
    ];

    return this.RepoResultHandler(() => queryDatabase(queryString, queryParameters));
  }

  static async updateOneFeat(identifier: string, properties: any) {
    const invalidProperty = Object.keys(properties).find( prop => !['questline_id', 'title', 'description','categories','tier', 'completed', 'xp', 'finished_at'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);

    const propertiesNamesMountedForUpdate = this.mountPropertiesNamesToUpdate(properties, 2);
    const propertiesValues = Object.values(properties);

    return this.RepoResultHandler(() => queryDatabase(`
      UPDATE feats 
      SET ${propertiesNamesMountedForUpdate}
      WHERE id = $1;
    `, [identifier, ...propertiesValues]));
  }

  static async deleteOneFeat(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`DELETE FROM feats WHERE id = $1;`, [identifier]))
  }
}


export default new FeatsRepoo(dbName, collectionName);