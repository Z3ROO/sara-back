import QuestsAPIHandlers from "./QuestsAPIHandlers";

export default [
  {
    method: 'get', path: '/quests/active-quest',
    handler: QuestsAPIHandlers.getActiveQuest
  },  
  {
    method: 'post', path: '/quests/questline/new',
    handler: QuestsAPIHandlers.createNewQuestline
  },  
  {
    method: 'get', path: '/quests/questline/all-finished',
    handler: QuestsAPIHandlers.getAllFinishedQuestlines
  },
  {
    method: 'get', path: '/quests/questline',
    handler: QuestsAPIHandlers.getListOfActiveQuestlines
  },
  {
    method: 'get', path: '/quests/questline/finish',
    handler: QuestsAPIHandlers.finishMainQuestline
  },
  {
    method: 'get', path: '/quests/questline/:questline_id',
    handler: QuestsAPIHandlers.getQuestlineInfo
  },
  {
    method: 'post', path: '/quests/quest/new',
    handler: QuestsAPIHandlers.createNewQuest
  },
  {
    method: 'post', path: '/quests/quest/handle-todo',
    handler: QuestsAPIHandlers.handleQuestTodo
  },
  {
    method: 'post', path: '/quests/quest/finish',
    handler: QuestsAPIHandlers.finishQuest
  },
  {
    method: 'get', path: '/quests/quest/distraction',
    handler: QuestsAPIHandlers.increaseDistractionScore
  }
]