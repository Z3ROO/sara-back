type levelHistory = {direction:-1|0|1, date: Date}[]

export type IInbox = IInboxItem[]

export interface IInboxItem {
  content: string
  reviewed: boolean
  nextReview: Date
}

export interface IQuestline {
  title: string
  description: string
  state: 'active'|'finished'|'invalidated'
  timecap: number|string
  created_at: Date
  finished_at: Date|null
  xp: number|null
}

export interface INewQuestline {
  title: string
  description: string
  timecap: number
}

export interface ISkill {
  title: string
  description: string
  created_at: Date
  level: number
}

export interface IQuest {
  questline_id: string|null
  skill_id: string|null
  mission_id: string|null
  title: string
  description: string
  type: 'main'|'side'|'mission'|'practice'
  state: 'active'|'deferred'|'finished'|'invalidated'
  todos: ITodo[]
  timecap: number|string
  pause: {
    start: Date
    finish: Date
  }[]
  focus_score: number|null
  distraction_score: Date[]
  created_at: Date
  finished_at: Date|null
  xp: number|null
}

export type ITodo = {
  description: string
  state: 'invalidated'|'finished'|'active'
  finished_at: Date|null
};

export interface INewQuest {
  questline_id?: string
  skill_id?: string
  mission_id?: string
  title: string
  description: string
  type: 'main'|'side'|'mission'|'practice'
  todos: string[],
  timecap: number|string
}

export interface IActions {
  questline_id?: string
  skill_id?: string
  mission_id?: string
  title: string
  description: string
  history: any[]
}

export interface IFeats {
  questline_id: string|null
  skill_id: string|null
  title: string
  description: string
  acceptance: {
    stage: 'created'|'reviewed'|'ready',
    date: Date[]
  }
  todos: ITodo[]|null
  categories: string[]
  tier: number
  completed: boolean
  xp: number|null
  finished_at: Date|null
}

export interface INewFeat {
  questline_id?: string|null
  skill_id?: string|null
  title: string
  description: string
  todos: string[]|null
  categories: string[]
  tier: number
}


export interface IRecords {
  questline_id: string|null
  skill_id: string|null
  title: string
  description: string
  acceptance: {
    stage: 'created'|'reviewed'|'ready',
    date: Date[]
  }
  metric: 'unit'|'time'|'distance'
  status: {
    waitTime: number
    stageAmount: number
    stage: number|null
    last_commitment: Date|null
  }
  categories: string[]
  level: number
  history: levelHistory
  xp: number|null
}

export interface INewRecord {
  questline_id?: string|null
  skill_id?: string|null
  title: string
  description: string
  metric: 'unit'|'time'|'distance'
  status: {
    waitTime: number
    stageAmount: number
  }
  categories: string[]
}

export interface IPills {
  name: string
  description: string
  times_taken: number
  next_shot: Date
  history: {increment:number, date: Date}[]
}

export interface INewPill {
  name: string
  description: string
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