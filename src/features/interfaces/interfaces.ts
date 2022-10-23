type levelHistory = {direction:-1|0|1, date: Date}[]

export interface IQuestLine {
  title: string
  description: string
  type: 'main'|'practice'
  state: 'active'|'finished'|'invalidated'
  timecap: number|string
  created_at: Date
  finished_at: Date|null
  level: number|null
  history: levelHistory|null
  xp: number
}

export interface IQuest {
  questline_id: string
  mission_id: string|null
  title: string
  description: string
  type: 'main'|'side'|'mission'
  state: 'active'|'deferred'|'finished'|'invalidated'
  todos: {
    description: string
    state: 'invalidated'|'finished'|'active'
    finished_at: Date|null
  }[]
  timecap: number|string
  focus_score: number|null
  distraction_score: number|null
  created_at: Date
  finished_at: Date|null
  xp: number
}

export interface IFeats {
  questline_id: string
  title: string
  description: string
  todos: {
    description: string
    complete: boolean
    finished_at: Date|null
  }[]
  categories: string[]
  tier: number
  completed: boolean
  xp: number
  created_at: Date
  finished_at: Date|null
}


export interface IRecords {
  questline_id: string
  title: string
  description: string
  metric: 'unit'|'time'|'distance'
  status: {
    state: number
    last_commitment: Date
  }|null
  categories: string[]
  level: number
  history: levelHistory
  xp: number
}

export interface IPassiveSkill {
  id?: string
  title: string
  description: string
  type?: 'passive'
  history: levelHistory
  boost: number
  stage?: number
  state?: 'active'|'sleep'|'complete'
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