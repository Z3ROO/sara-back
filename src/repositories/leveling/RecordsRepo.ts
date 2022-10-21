import { randomUUID } from "crypto"
import { IRecords } from "../../features/interfaces/interfaces";
import { queryDatabase } from "../../infra/database/postgresql"
import { RepositoryError } from "../../util/errors/RepositoryError"
import Repository from "../RepoResultHandler"

export class RecordsRepo extends Repository{
  static async findAllRecords() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM records;`));
  }

  static async findOneRecord(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM records WHERE id = $1;`, [identifier]));
  }

  static async findOneRecordByTitle(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM records WHERE title = $1;`, [identifier]));
  }
   
  static async findEveryRecordsHistoryInDateRange(begin: string, end: string) {
    return this.RepoResultHandler(() => queryDatabase(`
      SELECT id, questline_id, title, description, qtd, xp, current_level, finished_at FROM records_history 
      LEFT OUTER JOIN records ON id = record_id
      WHERE finished_at >= $1 AND finished_at <= $2;
      `,[begin, end]));
  }

  static async insertOneRecord(properties: IRecords) {
    const queryString = `
      INSERT INTO records (id, questline_id, title, description, qtd, categories, xp)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    const queryParameters = [
      randomUUID(),
      properties.questline_id,
      properties.title,
      properties.description,
      properties.qtd,
      properties.categories,
      properties.xp
    ];

    return this.RepoResultHandler(() => queryDatabase(queryString, queryParameters));
  }

  static async insertOneHistoryOfRecord(identifier: string, change: string, level: number) {
    return this.RepoResultHandler(() => queryDatabase(`
      INSERT INTO records_history (record_id, change, current_level, finished_at)
      VALUES ($1, $2, $3, $4);
    `,[identifier, change, level, this.currentDate()]));
  }

  static async updateOneRecord(identifier: string, properties: any) {
    const invalidProperty = Object.keys(properties).find( prop => !['questline_id', 'title', 'description', 'qtd', 'categories', 'tier', 'level', 'xp'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);

    const propertiesNamesMountedForUpdate = this.mountPropertiesNamesToUpdate(properties, 2);
    const propertiesValues = Object.values(properties);

    return this.RepoResultHandler(() => queryDatabase(`
      UPDATE records 
      SET ${propertiesNamesMountedForUpdate}
      WHERE id = $1;
    `, [identifier, ...propertiesValues]));
  }
  

  static async deleteOneRecord(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`DELETE FROM records WHERE id = $1;`, [identifier]))
  }
}