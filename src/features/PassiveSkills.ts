import { PassiveSkillsRepo } from "../repositories/leveling/PassiveSkillsRepo";

export class PassiveSkills {
  static async getPassiveSkillsHistoryOfOneDay(date: Date) {
    const beginning = date.toLocaleDateString('sv') + ' 00:00:00';
    const ending = date.toLocaleDateString('sv') + ' 23:59:59';
    const { records } = await PassiveSkillsRepo.findPassiveSkillsHistoryInDateRange(beginning, ending);
    
    return records;
  }

  static async getPassiveSkillsBoostUntilDate(date: Date|string) {
    if (typeof date === 'string')
      date = new Date(date);
      
    const untilDate = date.toLocaleDateString('sv');
    const { records } = await PassiveSkillsRepo.findPassiveSkillsHistoryBeforeDate(untilDate);
    
    if (records.length === 0)
      return 0

    const parsedHistory = this.extractFromHistory(records);
    const boost = parsedHistory.reduce((acc, skill) => acc += skill.boost, 0);
    return boost
  }

  private static extractFromHistory(history: any[], result = []) {
    const inAnalisys = {
      id: history[0].id,
      name: history[0].name,
      level: 0,
      boost: history[0].boost
    };

    let skillLevel: number = history
      .filter(val => val.id === inAnalisys)
      .reduce((acc, val) => {
        if (val.change === 'up')
          return acc += 1;
        else if (val.change === 'down')
          return acc -= 1;
        else if (val.change === 'same')
          return acc;
      }, 0);
    
    inAnalisys.level = skillLevel;
    inAnalisys.boost = Math.round(inAnalisys.boost + (inAnalisys.boost * 0.33 * skillLevel));

    result.push(inAnalisys);
    history = history.filter(val => val.id !== inAnalisys);

    if (history.length > 0)
      this.extractFromHistory(history, result);
    else
      return result;
  }
}