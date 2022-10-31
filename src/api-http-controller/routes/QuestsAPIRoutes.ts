import QuestsAPIHandlers from "./QuestsAPIHandlers";

export default [
  {
    method: 'get', path: '/quests/active-quest',
    handler: QuestsAPIHandlers.getActiveQuest
  },  
  {
    method: 'post', path: '/quests/questline/new',
    handler: QuestsAPIHandlers.createNewQuestLine
  },  
  {
    method: 'get', path: '/quests/questline/all-finished',
    handler: QuestsAPIHandlers.getAllFinishedQuestLines
  },
  {
    method: 'get', path: '/quests/questline',
    handler: QuestsAPIHandlers.getListOfActiveQuestLines
  },
  {
    method: 'get', path: '/quests/questline/finish',
    handler: QuestsAPIHandlers.finishMainQuestLine
  },
  {
    method: 'get', path: '/quests/questline/:questline_id',
    handler: QuestsAPIHandlers.getQuestLineInfo
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