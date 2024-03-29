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
  requerements?: []
}

export interface INewQuestline {
  title: string
  description: string
  timecap: number
}

export interface ISkill {
  name: string
  description: string
  children: string[]
  created_at: Date
  xp: number|null
}

export interface INewSkill {
  name: string
  description: string
}

// Quests exist to record the details of the action, basicly what I did in this brief period of time.
export interface IQuest {
  questline_id: string|null
  record_id: string|null
  mission_id: string|null
  title: string
  description: string 
  todos: ITodo[]
  progress: number
  state: 'active'|'finished'|'invalidated'
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
  doable_id?: string|null
  description: string
  state: 'active'|'finished'|'invalidated'
  finished_at: Date|null
};

export type INewTodo = {
  doable_id?: string|null
  description: string
}

export interface INewQuest {
  questline?: boolean
  record_id?: string
  mission_id?: string
  title: string
  description: string
  todos: INewTodo[]
  timecap: number|string
}

export interface IDeeds {
  description: string
  categories: string[]
  created_at: Date
  //remember: {}
}

export interface INewDeed {
  description: string
}

export type ItemTypes = 'article'|'book'|'flashcard'|'song';

export type MetricUnits = 'unit'|'time'|'distance'|'page';

export type RecordsMetric = 'progress-made'|'total-progress'|'boolean';

//Records exists to "record" the current state of an long-term action uppon an item.
export interface IRecords {
  skill_id: string
  action_skill_id: string
  title: string
  description: string
  todos: ITodo[]
  item_type: ItemTypes
  item_id: string|null
  categories: string[]
  progress: number
  cap: number
  level: number
  level_cap: number|null
  metric: RecordsMetric
  metric_unit: MetricUnits
  complete: boolean
  difficulty: 1|2|3|4|5
  engageable: {
    not_before: Date|null
    not_after: Date|null
    requirements: string[]
  }
  history: {
    date: Date, 
    progress: number
  }[]
}

export interface INewRecord {
  skill_id: string
  action_skill_id: string
  title: string
  description: string
  todos: INewTodo[]
  item_type: string
  item_id: string
  categories: string[]
  metric: RecordsMetric
  engageable: {
    not_before: Date|null
    not_after: Date|null
    requirements: string[]
  }
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