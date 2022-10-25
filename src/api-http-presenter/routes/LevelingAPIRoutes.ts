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

];