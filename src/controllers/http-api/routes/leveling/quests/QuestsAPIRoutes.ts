import QuestsAPIHandlers from "./QuestsAPIHandlers";

export default [
  {
    method: 'get', path: '/quests/active-quest',
    handler: QuestsAPIHandlers.getActiveQuest
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
  },
  {
    method: 'get', path: '/tey',
    handler: QuestsAPIHandlers.teyzada
  }
];
