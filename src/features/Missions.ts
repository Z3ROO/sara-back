import { MissionsRepo } from "../repositories/leveling/MissionsRepo";
import { IMission } from "./interfaces/interfaces";
import { Quest } from "./Quest";

export class Missions {
  static async getMissions() {
    const { records } = await MissionsRepo.findActiveMissions();
    return records
  }

  // static async getMissionsByQuestLine(questLineId: string) {
  //   const { records } = await MissionsRepo.findActiveMissionsByQuestLine(questLineId);
  //   return records
  // }

  static async getFinishedMissions() {
    const { records } = await MissionsRepo.findAllFinishedMissions();
    return records;
  }

  static async createNewMission(properties: IMission) {
    const { questline_id, title, description, todos, constraints, start_at } = properties;
    properties = {
      ...properties,
      todos: JSON.stringify(todos)
    }
    await MissionsRepo.insertNewMission(properties);
    return
  }

  static async initMission(identifier: string) {
    const { record } = await MissionsRepo.findMissionById(identifier);
    const mission = record;
 
    await Quest.createNewQuest({questline_id: mission.questline_id, title: mission.title, description: mission.description, type: 'mission', timecap: mission.timecap}, mission.todos)
    return
  }

  static async syncMissionsState(identifier: string, yesterday: Date) {
    const { record } = await MissionsRepo.findMissionById(identifier);
    const mission = record;
    let props:any;
    if (mission.type === 'qtd') {
      if (new Date().getTime() - yesterday.getTime() > (2 * 24 * 60 * 60 * 1000)) {
        props.last_update = MissionsRepo.currentDate();
        props.state = ''
      }

    }
    await MissionsRepo.updateMission(identifier, {
      last_sync: MissionsRepo.currentDate(),
      ...props
    })
  }

  static async finishMissionCycle(identifier: string, options: any) {
    const { status, qtd } = options;
    const {record} = await MissionsRepo.findMissionById(identifier);
    const mission = {
      ...record,
      stage: JSON.parse(record.stage),
      constraints: JSON.parse(record.constraints)
    };

    await MissionsRepo.updateMission(identifier, {
      state: 'cleaned',
      stage: mission.type === 'qtd' ? mission.stage.concat(qtd) : mission.stage+1,
    });

    if ((mission.type === 'qtd' && mission.stage.concat(qtd).reduce((acc:number, val:number) => acc + val) === mission.constraints)
    || (mission.type === 'time' && mission.stage === mission.constraints[8]))
      this.finishMission(identifier);

    return;
  }

  static async resetMission(identifier: string) {

  }

  static async finishMission(identifier: string) {
    await MissionsRepo.updateMission(identifier, {
      finished_at: MissionsRepo.currentDate(),
      state: 'finished'
    })
    
    return
  }

  static async giveUpOnMission(identifier: string) {
    await MissionsRepo.updateMission(identifier, {
      finished_at: MissionsRepo.currentDate(),
      state: 'given-up'
    });

    return
  }
}