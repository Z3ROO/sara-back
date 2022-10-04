import Repository from "../RepoResultHandler"
import { handleTransaction, queryDatabase } from '../../infra/database/index';
import { RepositoryError } from "../../util/errors/RepositoryError";
import { randomUUID } from 'crypto';
import { IQuestLine } from "../../features/interfaces/interfaces";

export class QuestLineRepo extends Repository{
  static async findMainQuestLine(){
    const queryString = `SELECT * FROM questlines WHERE type = 'main' AND state = 'active'`;
    return this.RepoResultHandler(() => queryDatabase(queryString,[]));
  }
  
  static async findAllActiveQuestLines(){
    const queryString = `SELECT * FROM questlines WHERE state = 'active';`;
    return this.RepoResultHandler(() => queryDatabase(queryString, []));
  }

  static async findAllFinishedQuestLines(){
    const queryString = `SELECT * FROM questlines WHERE state = 'finished';`;
    return this.RepoResultHandler(() => queryDatabase(queryString, []));
  }
  
  static async findOneQuestLine(identifier: string) {
    const queryString = `SELECT * FROM questlines WHERE id = $1;`;
    
    return this.RepoResultHandler(() => queryDatabase(queryString, [identifier]));
  }

  static async findOneQuestLineByTitle(identifier: string) {
    const queryString = `SELECT * FROM questlines WHERE title = $1;`;
    
    return this.RepoResultHandler(() => queryDatabase(queryString, [identifier]));
  }

  static async findFineshedQuestLineInDateRange(beginning: string, ending: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM questlines WHERE finished_at >= $1 AND finished_at <= $2;`, [beginning, ending]))
  }

  static async createNewQuestLine(questProperties: IQuestLine) {
    const { title, description, type, timecap } = questProperties;
    const propertiesKeys = Object.keys(questProperties);
    const propertiesValues = Object.values(questProperties);
    
    const isTypeValid = ['main', 'practice'].includes(type);
    const isEveryPropertyKeyValid = propertiesKeys.every(prop => ['title', 'description', 'type', 'timecap'].includes(prop));
    
    if (!isEveryPropertyKeyValid)
      throw new RepositoryError('An invalid questline_property was issued.');
    if (!isTypeValid)
      throw new RepositoryError('An invalid questline_type was issued');
      
    const parametersPosition = propertiesKeys.map((prop, ind) => `$${ind+4}`).toString();
    
    const primaryKeyUUID = randomUUID();
    const created_at = this.currentDate();
    const xp = 1000;

    const queryString = `
      INSERT INTO questlines (id, created_at, xp, ${propertiesKeys.toString()})
      VALUES ($1, $2, $3, ${parametersPosition});
    `;

    if (type === 'main'){      
      const transaction = await handleTransaction(async (transaction) => {

        const mainQuestLine = await transaction.query(`
          SELECT * FROM questlines WHERE type = 'main' AND state = 'active';
        `,[]);

        if (mainQuestLine.rowCount >= 1)
          throw new RepositoryError('There is a main quest line activated already');

        await  transaction.query(queryString, [primaryKeyUUID, created_at, xp, ...propertiesValues]);
      });

      return transaction
    }

    return this.RepoResultHandler(() => queryDatabase(queryString, [primaryKeyUUID, created_at, xp, ...propertiesValues]))    
  }

  static async finishMainQuestLine() {
    const finished_at = this.currentDate();
    return this.RepoResultHandler(() => queryDatabase(`
      UPDATE questlines 
      SET finished_at = $1, state = 'finished'
      WHERE type = 'main' AND state = 'active'
    `, [finished_at]));
  }
  
  static async invalidateQuestLine(identifier: string) {
    const finished_at = this.currentDate();
    return this.RepoResultHandler(() => queryDatabase(`
      UPDATE questlines 
      SET finished_at = $2, state = 'invalidated'
      WHERE id = $1
    `, [identifier, finished_at]));
  }

  static async deleteQuestline(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`DELETE FROM questlines WHERE id = $1`,[identifier]))
  }
}