import StatsAPIHandlers from "./LevelingAPIHandlers";

export default [
  {
    method: 'get', path: '/leveling/stats',
    handler: StatsAPIHandlers.getOverallStats
  },
  {
    method: 'get', path: '/leveling/active-quest',
    handler: StatsAPIHandlers.getActiveQuest
  },
  {
    method: 'get', path: '/leveling/questline/info/:id',
    handler: StatsAPIHandlers.getQuestLineInfo
  },
  {
    method: 'get', path: '/leveling/questline/list',
    handler: StatsAPIHandlers.getListOfActiveQuestLines
  },
  {
    method: 'post', path: '/leveling/quest/new',
    handler: StatsAPIHandlers.createNewQuest
  },
  {
    method: 'post', path: '/leveling/quest/todo',
    handler: StatsAPIHandlers.handleQuestTodo
  },
  {
    method: 'post', path: '/leveling/quest/finish',
    handler: StatsAPIHandlers.finishQuest
  },
  {
    method: 'post', path: '/leveling/quest/distraction',
    handler: StatsAPIHandlers.increaseDistractionScore
  },
  {
    method: 'post', path: '/leveling/questline/finish',
    handler: StatsAPIHandlers.finishMainQuestLine
  },
  {
    method: 'get', path: '/leveling/questline/all-finished',
    handler: StatsAPIHandlers.getAllFinishedQuestLines
  },
  {
    method: 'post', path: '/leveling/questline/new',
    handler: StatsAPIHandlers.createNewQuestLine
  },
  {
    method: 'get', path: '/leveling/feats',
    handler: StatsAPIHandlers.getFeats
  },
  {
    method: 'post', path: '/leveling/feats/complete',
    handler: StatsAPIHandlers.completeFeat
  },
  {
    method: 'post', path: '/leveling/feats/new',
    handler: StatsAPIHandlers.createNewFeat
  },
  {
    method: 'get', path: '/leveling/records',
    handler: StatsAPIHandlers.getRecords
  },
  {
    method: 'post', path: '/leveling/records/up',
    handler: StatsAPIHandlers.updateRecordLevel
  },
  {
    method: 'post', path: '/leveling/records/new',
    handler: StatsAPIHandlers.createNewRecord
  }
];