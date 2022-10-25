import QuestsAPIHandlers from "./QuestsAPIHandlers";

export default [
  {
    method: 'get', path: '/quests/active-quest',
    handler: QuestsAPIHandlers.getActiveQuest
  },
  {
    method: 'get', path: '/quests/questline/:id',
    handler: QuestsAPIHandlers.getQuestLineInfo
  },
  {
    method: 'get', path: '/quests/questline',
    handler: QuestsAPIHandlers.getListOfActiveQuestLines
  },
  {
    method: 'post', path: '/quests/quest/new',
    handler: QuestsAPIHandlers.createNewQuest
  },
  {
    method: 'post', path: '/quests/quest/todo',
    handler: QuestsAPIHandlers.handleQuestTodo
  },
  {
    method: 'post', path: '/quests/quest/finish',
    handler: QuestsAPIHandlers.finishQuest
  },
  {
    method: 'get', path: '/quests/quest/distraction',
    handler: QuestsAPIHandlers.increaseDistractionScore
  },
  {
    method: 'get', path: '/quests/questline/finish',
    handler: QuestsAPIHandlers.finishMainQuestLine
  },
  {
    method: 'get', path: '/quests/questline/all-finished',
    handler: QuestsAPIHandlers.getAllFinishedQuestLines
  },
  {
    method: 'post', path: '/quests/questline/new',
    handler: QuestsAPIHandlers.createNewQuestLine
  },
]