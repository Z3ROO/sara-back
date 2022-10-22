export interface IQuestLine {
  id?: string
  title: string
  description: string
  type: 'main'|'practice'
  state?: 'active'|'finished'|'invalidated'
  timecap: number|string
  created_at?: string
  finished_at?: string
  xp?: number
}

export interface IAchievement {
  id?: string
  questline_id: string
  title: string
  description: string
  requirements: string
  type: 'achievement'|'title'
  completed?: boolean
  boost: number
  xp: number
  finished_at?: string
}

export interface IUpdateAchievement {
  questline_id?: string
  title?: string
  description?: string
  requirements?: string
  type?: 'achievement'|'title'
  completed?: boolean
  boost?: number
  xp?: number
  finished_at?: string
}

export interface IFeats {
  id?: string
  questline_id: string
  title: string
  description: string
  categories: string
  tier: number
  completed?: boolean
  xp?: number
  finished_at?: Date
}


export interface IRecords {
  id?: string
  questline_id: string
  title: string
  description: string
  qtd: number
  categories: string
  tier: number
  level?: number
  xp?: number
}

export interface IPassiveSkill {
  id?: string
  title: string
  description: string
  type?: 'passive'
  boost: number
  stage?: number
  state?: 'active'|'sleep'|'complete'
}

export interface IUpdatePassiveSkill {
  title?: string
  description?: string
  boost?: number
  stage?: number
  state?: 'active'|'sleep'|'complete'
}

interface IPassiveSkillsHistory {
  passive_skill_id: string
  change: 'up'|'down'|'same'
  current_level: number
  finished_at: string
}

export interface ISupplements {
  id?: string
  name:'Free Time'
  qtd: number
  consumed_at?: string
}
export interface IQuest {
  id?: string
  questline_id: string
  mission_id?: string
  title: string
  description: string
  type: 'main'|'side'|'mission'|'record'
  state?: 'active'|'deferred'|'finished'|'invalidated'
  timecap: number|string
  focus_score?: number
  distraction_score?: number
  created_at?: string
  finished_at?: string
  xp?: number
}

export interface IStats {
  player: string
  level: number
  maestria: string
  xp: number
  nextLevelXp: number
  lastLevelXp: number
  day: Date
  todaysHistory: {
    type: string
    body: any
  }[]
  weekProgress: {status: 0|1|2|3, hours:number}[]
  dayOff: boolean
  freeTime: number
  debitedHours: number
  hashiras: IHashiras
}

export interface IHashiras {
  planning:{
    name: string
    title: string
    level: number
    score: number
    todaysEarnings: number
  }
  focus: {
    name: string
    title: string
    level: number
    score: number
    todaysEarnings: number
  }
  perseverence: {
    name: string
    title: string
    level: number
    score: number
    todaysEarnings: number
    goal: number
  }
}

export interface IMission {
  id?: string
  questline_id: string
  title: string
  description: string
  todos: string
  type: 'time'|'qtd'
  state?: 'cleaned'|'to-do'|'finished'|'given-up'
  attempts?: number
  timecap: number
  constraints: string //[0,1,0,1,0,1,0,(5|2022-10-07)]|254 
  stage?: string //3|[25,78,36,54,68]
  created_at?: string
  start_at: string
  last_sync?: string
  last_update?: string
  finished_at?: string
}
