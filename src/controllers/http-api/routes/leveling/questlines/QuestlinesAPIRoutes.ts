import QuestlinesAPIHandlers from "./QuestlinesAPIHandlers";

export default [
  {
    method: 'get', path: '/leveling/questlines',
    handler: QuestlinesAPIHandlers.getActiveQuestlines
  },
  {
    method: 'post', path: '/leveling/questlines/new',
    handler: QuestlinesAPIHandlers.createNewQuestline
  },  
  {
    method: 'get', path: '/leveling/questlines/all',
    handler: QuestlinesAPIHandlers.getAllQuestlines
  },  
  {
    method: 'get', path: '/leveling/questlines/all-finished',
    handler: QuestlinesAPIHandlers.getAllFinishedQuestlines
  },
  {
    method: 'get', path: '/leveling/questlines/finish',
    handler: QuestlinesAPIHandlers.finishActiveQuestline
  },
  {
    method: 'get', path: '/leveling/questlines/invalidate',
    handler: QuestlinesAPIHandlers.invalidateActiveQuestline
  },
  {
    method: 'get', path: '/leveling/questlines/:questline_id',
    handler: QuestlinesAPIHandlers.getOneQuestline
  },
  {
    method: 'delete', path: '/leveling/questlines/:questline_id',
    handler: QuestlinesAPIHandlers.deleteOneQuestline
  }
];
