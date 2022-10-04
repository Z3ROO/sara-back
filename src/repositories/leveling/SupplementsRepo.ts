import { randomUUID } from "crypto";
import { ISupplements } from "../../features/interfaces/interfaces";
import { queryDatabase } from "../../infra/database";
import Repository from "../RepoResultHandler";

export class SupplementsRepo extends Repository {
  static async findAllSupplements() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM supplements;`));
  }

  static async findSupplementsByName(supplementName: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM supplements WHERE name = $1;`,[supplementName]));
  }

  static async insertSupplement(properties:ISupplements) {
    const {name, qtd} = properties;
    const consumed_at = this.currentDate();
    const queryString = `
      INSERT INTO supplements (id, name, qtd, consumed_at)
      VALUES ($1, $2, $3, $4);
    `;
    const primaryKeyUUID = randomUUID();
    await this.RepoResultHandler(() => queryDatabase(queryString,[primaryKeyUUID, name, qtd, consumed_at]));
    
    return {id: primaryKeyUUID}
  }
}