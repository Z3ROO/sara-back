import { randomUUID } from "crypto"
import { IQuest } from "../../features/interfaces/interfaces";
import { handleTransaction, queryDatabase } from "../../infra/database"
import { RepositoryError } from "../../util/errors/RepositoryError"
import Repository from "../RepoResultHandler"

export class QuestRepo extends Repository{
  static async findMainQuest() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE type != 'side' AND state = 'active';`,[]));
  }

  static async findOneQuest(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE id = $1;`,[identifier]));
  }

  static async findActiveSideQuest() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE type = 'side' AND state = 'active';`))
  }

  static async findAllSideQuests() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE type = 'side' AND state != 'finished';`, []));
  }

  static async findAllFinishedQuests() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE (state = 'finished' OR state = 'invalidated');`, []))
  }

  static async findAllFinishedMainQuests() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE state = 'finished' AND type != 'side';`, []))
  }

  static async findAllFinishedSideQuests() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE state = 'finished' AND type = 'side';`, []))
  }

  static async findAllFinishedQuestsInDateRange(begin: string, end: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests WHERE (state = 'finished' OR state = 'invalidated') AND finished_at >= $1 AND finished_at <= $2;`, [begin, end]));
  }

  // //TEST
  // static async findFirstQuestEver() {
  //   return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests ORDER BY finished_at LIMIT 1;`))
  // }


  static async insertNewQuest(properties: IQuest) {
    const { questline_id, title, description, type, timecap, xp } = properties;
    const propertiesKeys = Object.keys(properties);
    const propertiesValues = Object.values(properties);
    const receivablePropertiesKeys = ['questline_id', 'title', 'description', 'type', 'timecap', 'xp'];
    const isEveryPropertyKeyValid = propertiesKeys.every(prop => receivablePropertiesKeys.includes(prop));
    const parametersPosition = propertiesKeys.map((prop, ind) => `$${ind+4}`).toString();
    const primaryKeyUUID = randomUUID();
    const created_at = this.currentDate();
    const queryString = `
      INSERT INTO quests (id, created_at, state, ${propertiesKeys.toString()})
      VALUES ($1, $2, $3, ${parametersPosition});
    `
    console.log(created_at);
    if (!isEveryPropertyKeyValid)
      throw new RepositoryError('An invalid propertie was issued at createNewQuest');

    if (type === 'main') {
      const transaction = await handleTransaction(async (transaction) => {
        const mainQuest = await transaction.query(`SELECT * FROM quests WHERE type != 'side' AND state = 'active'`);

        if (mainQuest.rowCount >= 1)
          throw new RepositoryError('An active main quest already exists');

        await transaction.query(queryString, [primaryKeyUUID, created_at, 'active', ...propertiesValues]);
      });

      return {id: primaryKeyUUID};
    }
    else if (type === 'side'){
      const transaction = await handleTransaction(async (transaction) => {
        const sideQuests = await transaction.query(`SELECT * FROM quests WHERE type = 'side' AND state != 'finished';`)

        if (sideQuests.rowCount >= 5)
          throw new RepositoryError('Maximum sidequests exceeded')
        
        await transaction.query(queryString, [primaryKeyUUID, created_at, 'deferred', ...propertiesValues]);
      });

      return {id: primaryKeyUUID};
    }
  }

  static async finishQuest(identifier: string, focus_score: number) {
    const transaction = await handleTransaction(async (transaction) => {
      const { rows } = await transaction.query(`SELECT * FROM quests WHERE id = $1`, [identifier]);
      const finished_at = this.currentDate();
      if (rows[0]?.state === 'active') {
        await transaction.query(`
          UPDATE quests
          SET finished_at = $2, focus_score = $3, state = 'finished'
          WHERE id = $1;
        `,[identifier, finished_at, focus_score]);
  
      }
      else
        throw new RepositoryError('Quest cant be finished.');
    });

    return transaction
  }

  static async insertDistractionPoint(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`UPDATE quests SET distraction_score = (distraction_score::INTEGER + 1) WHERE id = $1`, [identifier]))
  }

  static async deleteQuest(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`DELETE FROM quests WHERE id = $1;`,[identifier]))
  }

  static async activateSideQuest(identifier: string) {
    const transaction = await handleTransaction(async (transaction) => {
      const { rows } = await transaction.query(`SELECT * FROM quests WHERE type = 'side' AND state != 'finished'`);
      
      if (rows.find(row => row.state === 'active'))
        throw new RepositoryError('Already exist a side quest active.')
      
      await transaction.query(`
        UPDATE quests
        SET state = 'active'
        WHERE id = $1;
      `, [identifier]);
    });

    return transaction;
  }
}

/*
  questline_table
  quest_table
  questtodo_table
  finished_questline_table
  finished_quest_table
  finished_questtodo_table
*/