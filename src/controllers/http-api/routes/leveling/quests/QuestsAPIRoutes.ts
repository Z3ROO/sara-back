import QuestsAPIHandlers from "./QuestsAPIHandlers";

export default [
  {
    method: 'get', path: '/leveling/active-quest',
    handler: QuestsAPIHandlers.getActiveQuest
  },
  {
    method: 'get', path: '/leveling/quest/distraction',
    handler: QuestsAPIHandlers.increaseDistractionScore
  },
  {
    method: 'post', path: '/leveling/quest/handle-todo',
    handler: QuestsAPIHandlers.handleQuestTodo
  },
  {
    method: 'post', path: '/leveling/quest/new',
    handler: QuestsAPIHandlers.createNewQuest
  },
  {
    method: 'post', path: '/leveling/quest/finish',
    handler: QuestsAPIHandlers.finishQuest
  },
  {
    method: 'post', path: '/leveling/quest/finish',
    handler: QuestsAPIHandlers.invalidateQuest
  }
];
