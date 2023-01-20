import { Quests } from "./leveling/Quests";

export interface IGainsHistory {
  name: string
  type: string
  xp: number
  boostXp: number
  status: number
  start: Date
  end: Date
}

export class Stats {
  static async getGainsHistoryInOneDay(date: Date): Promise<IGainsHistory[]> {
    const quests = (await Quests.getEveryFinishedQuestOfOneDay(date))
      .map(quest => {
        const {title, xp, state, created_at, finished_at} = quest;
        return {
          name: title,
          type: 'quest',
          xp: xp,
          boostXp: 0,
          status: state === 'invalidated' ? -1 : 1,
          start: created_at,
          end: finished_at
        }
      });
    
    return quests
  }
}