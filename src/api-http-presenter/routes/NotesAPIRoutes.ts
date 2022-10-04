import NotesAPIHandlers from "./NotesAPIHandlers";
export default [
  {
    method: 'get', path: '/notes',
    handler: NotesAPIHandlers.getCategories
  },
  {
    method: 'get', path: '/notes/:category/content',
    handler: NotesAPIHandlers.getNotebooks
  },
  {
    method: 'get', path: '/notes/:category/:notebook/content',
    handler: NotesAPIHandlers.getSections
  },
  {
    method: 'post', path: '/notes/:category/:notebook/section/content',
    handler: NotesAPIHandlers.getSectionSections
  },
  {
    method: 'post', path: '/notes/:category/:notebook/section/page',
    handler: NotesAPIHandlers.getPage
  },
  {
    method: 'post', path: '/notes/:category/new-notebook',
    handler: NotesAPIHandlers.createNewNotebook
  },
  {
    method: 'post', path: '/notes/new-section',
    handler: NotesAPIHandlers.createNewSection
  },
  {
    method: 'post', path: '/notes/new-page',
    handler: NotesAPIHandlers.createNewPage
  },
  {
    method: 'put', path: '/notes/:category/:notebook/section/page/save',
    handler: NotesAPIHandlers.savePage
  },
  {
    method: 'delete', path: '/notes/:category/:notebook/notebook/delete',
    handler: NotesAPIHandlers.deleteNotebook
  },
  {
    method: 'delete', path: '/notes/:category/:notebook/section/delete',
    handler: NotesAPIHandlers.deleteSection
  },
  {
    method: 'delete', path: '/notes/:category/:notebook/page/delete',
    handler: NotesAPIHandlers.deletePage
  }
];