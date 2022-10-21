import { randomUUID } from "crypto"
import { IPassiveSkill, IUpdatePassiveSkill } from "../../features/interfaces/interfaces";
import { queryDatabase } from "../../infra/database/postgresql"
import { RepositoryError } from "../../util/errors/RepositoryError"
import Repository from "../RepoResultHandler"

export class PassiveSkillsRepo extends Repository{
  static async findAllPassiveSkills() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM passive_skills;`));
  }

  static async findOnePassiveSkill(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM passive_skills WHERE id = $1;`, [identifier]));
  }

  static async findOnePassiveSkillByTitle(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM passive_skills WHERE title = $1;`, [identifier]));
  }

  static async findPassiveSkillsHistoryBeforeDate(date: string) {
    const queryString = `
      SELECT passive_skill_id, title, description, boost, change, finished_at, current_level FROM passive_skills_history 
      LEFT OUTER JOIN passive_skills ON passive_skill_id = id
      WHERE finished_at <= $1;
    `;

    return this.RepoResultHandler(() => queryDatabase(queryString, [date]));
  }
  
  static async findPassiveSkillsHistoryInDateRange(begin: string, end: string) {
    const queryString = `
      SELECT passive_skill_id, title, description, boost, change, finished_at, current_level FROM passive_skills_history 
      LEFT OUTER JOIN passive_skills ON passive_skill_id = id
      WHERE finished_at >= $1 AND finished_at <= $2;
    `;
    return this.RepoResultHandler(() => queryDatabase(queryString, [begin, end]));
  }

  static async insertOnePassiveSkill(properties: IPassiveSkill) {
    const queryString = `
      INSERT INTO passive_skills (id, title, description, boost)
      VALUES ($1, $2, $3, $4);
    `;
    const queryParameters = [
      randomUUID(),
      properties.title,
      properties.description,
      properties.boost
    ];

    return this.RepoResultHandler(() => queryDatabase(queryString, queryParameters));
  }

  static async updateOnePassiveSkill(identifier: string, properties: IUpdatePassiveSkill) {
    const invalidProperty = Object.keys(properties).find( prop => !['title', 'description', 'boost', 'stage', 'state'].includes(prop))
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);

    const propertiesNamesMountedForUpdate = this.mountPropertiesNamesToUpdate(properties, 2);
    const propertiesValues = Object.values(properties);

    return this.RepoResultHandler(() => queryDatabase(`
      UPDATE passive_skills 
      SET ${propertiesNamesMountedForUpdate}
      WHERE id = $1;
    `, [identifier, ...propertiesValues]));
  }

  static async deleteOnePassiveSkill(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`DELETE FROM passive_skills WHERE id = $1;`, [identifier]))
  }
}