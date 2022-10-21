import { RepositoryError } from '../../util/errors/RepositoryError';
import { IAchievement, IUpdateAchievement } from '../../features/interfaces/interfaces';
import { queryDatabase } from '../../infra/database/postgresql'
import Repository from '../RepoResultHandler';
import { randomUUID } from 'crypto';

export default class AchievementsRepo extends Repository {
  static async findAllAchievements() {
    return this.RepoResultHandler(() => queryDatabase('SELECT * FROM achievements',[]))
  }

  static async findOneAchievement(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM achievements WHERE id = $1`, [identifier]));
  }
  
  static async findOneAchievementByTitle(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM achievements WHERE title = $1`, [identifier]));
  }
  
  static async findAllAchievementsInDateRange(begin: string, end: string) {
    const queryString = `
      SELECT * FROM achievements WHERE completed = true AND finished_at >= $1 AND finished_at <= $2;
    `;
    return this.RepoResultHandler(() => queryDatabase(queryString, [begin, end]))
  }
  
  static async findAllCompletedTitles() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM achievements WHERE type = 'title' AND completed = true;`))
  }
  
  static async findAllCompletedTitlesBeforeDate(date: string) {
    const queryString = `
      SELECT * FROM achievements 
      WHERE type = 'title' AND completed = true AND finished_at <= $1;
    `;

    return this.RepoResultHandler(() => queryDatabase(queryString, [date]))
  }
  
  static async insertOneAchievement({questline_id, title, description, requirements, type, boost, xp}:IAchievement){
    const queryString = `
      INSERT INTO achievements (id, questline_id, title, description, requirements, type, boost, xp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;
    return this.RepoResultHandler(() => queryDatabase(queryString, [randomUUID(), questline_id, title, description, requirements, type, boost, xp]));
  }
  
  static async updateAchievementProperties(identifier: string, properties: IUpdateAchievement) {
    const invalidProperty = Object.keys(properties).find( prop => !['questline_id', 'title', 'description', 'requirements', 'type', 'completed', 'boost', 'xp', 'finished_at'].includes(prop));
    if (invalidProperty)
      throw new RepositoryError('Invalid property issued: '+ invalidProperty);

    const propertiesNamesToUpdate = this.mountPropertiesNamesToUpdate<IUpdateAchievement>(properties, 2);
    const propertiesValueAsParameters = Object.values(properties);

    let queryString = `
        UPDATE achievements
        SET ${propertiesNamesToUpdate}
        WHERE title = $1;
      `;
    
    return this.RepoResultHandler(() => queryDatabase(queryString, [identifier, ...propertiesValueAsParameters]));
  }
  
  static async deleteOneAchievement(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`DELETE FROM achievements WHERE title = $1`, [identifier]));
  }
}
