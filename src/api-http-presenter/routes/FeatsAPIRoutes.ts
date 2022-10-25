import FeatsAPIHandlers from "./FeatsAPIHandlers";

export default [
  {
    method: 'get', path: '/feats',
    handler: FeatsAPIHandlers.getFeats
  },
  {
    method: 'post', path: '/feats/complete',
    handler: FeatsAPIHandlers.completeFeat
  },
  {
    method: 'post', path: '/feats/new',
    handler: FeatsAPIHandlers.createNewFeat
  },
]