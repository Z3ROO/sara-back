import { randomUUID } from "crypto"
import { handleTransaction, queryDatabase } from "../../infra/database/postgresql"
import Repository from "../RepoResultHandler"

interface IQuestTodo {
  id?: number
  quest_id?: number
  description: string
  state?: 'invalidated'|'finished'|'active'
  finished_at?: string
}

export class QuestTodosRepo extends Repository {
  static async findOneQuestTodo(todoIdentifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests_todos WHERE id = $1;`,[todoIdentifier]));
  }

  static async findAllQuestTodos(questIdentifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests_todos WHERE quest_id = $1;`,[questIdentifier]));
  }

  static async findAllFinishedTodos() {
    return this.RepoResultHandler(() => queryDatabase(`SELECT * FROM quests_todos WHERE state = 'finished';`,[]))
  }

  static async createBatchOFTodos(questIdentifier: string, todos: string[]) {
    const transaction = await handleTransaction(async (transaction) => {
      for (let i = 0; i < todos.length; i++) {
        await transaction.query(`
          INSERT INTO quests_todos (id, quest_id, description)
          VALUES ($1, $2, $3);
        `, [randomUUID(), questIdentifier, todos[i]]);
      }
    });

    return transaction;
  }

  static async invalidateQuestTodo(todoIdentifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`UPDATE quests_todos SET state = 'invalidated' WHERE id = $1;`, [todoIdentifier]));
  }

  static async finishQuestTodo(todoIdentifier: string) {
    return this.RepoResultHandler(() => queryDatabase(`UPDATE quests_todos SET state = 'finished', finished_at = $2 WHERE id = $1;`, [todoIdentifier, this.currentDate()]));
  }
}
