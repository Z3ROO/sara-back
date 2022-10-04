import { randomUUID } from "crypto";
import { IMission } from "../../features/interfaces/interfaces";
import { queryDatabase } from "../../infra/database";
import { RepositoryError } from "../../util/errors/RepositoryError";
import Repository from "../RepoResultHandler";

export class MissionsRepo extends Repository {
  static async findMissionById(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM missions WHERE id = $1;`, [identifier]));
  }

  static async findActiveMissions() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM missions WHERE state = 'finished';`));
  }
  
  static async findAllFinishedMissions() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM missions WHERE state = 'finished';`));
  }

  static async findMissionFinishedBeforeDate(date: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM missions WHERE state = 'finished' AND finished_at <= $1`, [date]));
  }

  static async findMissionFinishedInDateRange(begin: string, ending: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM missions WHERE state = 'finished' AND finished_at <= $1`, [begin, ending]));
  }

  static async insertNewMission(properties: IMission) {
    const { questline_id, title, description, todos, constraints, start_at} = properties
    return this.RepoResultHandler(() => queryDatabase(`
      INSERT INTO missions (id, questline_id, title, description, todos, constraints, start_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `, [randomUUID(), questline_id, title, description, todos, constraints, start_at]));
  }

  static async updateMission(identifier: string, properties: any) {
    const itsAllPropsValid = Object.keys(properties).every(
      prop => [
      'questline_id',
      'title',
      'description',
      'todos',
      'state',
      'attempts',
      'contraints',
      'stage',
      'created_at',
      'start_at',
      'last_attempt',
      'finished_at'].includes(prop)
    );

    if (!itsAllPropsValid)
      throw new RepositoryError('Invalid property for Mission.');
    
    const propertiesValues = Object.values(properties);
    const propsNamesAndPositions = this.mountPropertiesNamesToUpdate(properties, 2);

    return this.RepoResultHandler(() => queryDatabase(`
      UPDATE missions SET ${propsNamesAndPositions}
      WHERE id = $1;
    `, [identifier, ...propertiesValues]));
  }

  static async deleteMission(identifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`DELETE FROM missions WHERE id = $1`, [identifier]))
  }
}