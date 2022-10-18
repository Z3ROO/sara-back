import NotesAPIHandlers from "./NotesAPIHandlers";
export default [
  {
    method: 'get', path: '/notes/tree-listing/:category',
    handler: NotesAPIHandlers.getTreeListing
  },
  {
    method: 'get', path: '/notes/note/*',
    handler: NotesAPIHandlers.getNote
  },
  {
    method: 'post', path: '/notes/folder',
    handler: NotesAPIHandlers.createFolder
  },
  {
    method: 'post', path: '/notes/note',
    handler: NotesAPIHandlers.createNote
  },
  {
    method: 'post', path: '/notes/save-note/*/*.md',
    handler: NotesAPIHandlers.saveNote
  },
  // {
  //   method: 'delete', path: '/notes/note/*/*.md',
  //   handler: NotesAPIHandlers.deleteFolder
  // },
  // {
  //   method: 'delete', path: '/notes/folder/*/*.md',
  //   handler: NotesAPIHandlers.deleteNote
  // },
];