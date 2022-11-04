import { Dirent } from 'fs';
import fs from 'fs/promises';
import path from 'path';

const notesDir = path.join(__dirname, '../../../../../notes/');

export default class NotesAPIHandlers {
  // get'/notes/tree-listing/:category'
  static async getTreeListing(req: any, res: any) {
    const { category } = req.params;

    console.log(req.params)

    const listing = [await NotesAPIHandlers.buildListing([category])]

    return {
      body: listing
    }
  }

  private static async buildListing(directory: string[], nodeStat?: Dirent) {
    const finalDir = path.join(notesDir, ...directory);
    
    let dirListing:Dirent[];
    if (directory.length === 1 || (nodeStat && nodeStat.isDirectory()))
      dirListing = await fs.readdir(finalDir, {withFileTypes: true});

    const node:any = {};

    if (directory.length === 1){
      node.name = directory[0];
      node.type = 'category';
    }
    else {
      node.name = directory[directory.length - 1];
      node.type = nodeStat.isDirectory() ? 'folder' : 'file';
    }

    if (directory.length === 1 || (nodeStat && nodeStat.isDirectory()))
      node.content = await Promise.all(dirListing.map(async (val) => {
        return await NotesAPIHandlers.buildListing([...directory, val.name], val)
      }));
    
    return node;
  }

  // get'/notes/note/*/*.md'
  static async getNote(req:any, res:any) {
    const pathToNote = path.join(notesDir,req.params[0]);
    const fileContent = await fs.readFile(pathToNote, 'utf-8');
    
    return {
      body: fileContent
    };
  }

  // post'/notes/folder'
  static async createFolder(req: any, res: any) {
    let {directory, name} = req.body;
    name = name.replace(/ /g, '_');
    const finalDir = path.join(notesDir, ...directory, name);
    await fs.mkdir(finalDir);

    return {
      status: 201,
      message: 'Folder created'
    }
  }

  // post'/notes/note'
  static async createNote(req: any, res: any) {
    let {directory, name} = req.body;
    name = name.replace(/ /g, '_');
    if (!name.match(/.+\.md$/))
      name += '.md'
    const finalDir = path.join(notesDir, ...directory, name)
    await fs.writeFile(finalDir, '', 'utf-8');

    return {
      status: 201,
      message: 'Note created'
    }
  }

  // post'/notes/save-note
  static async saveNote(req: any, res:any) {
    const { directory, content } = req.body;
    
    const finalDir = path.join(notesDir, ...directory);

    await fs.writeFile(finalDir, content, 'utf-8');

    return {
      status: 202,
      message: 'Note saved'
    }
  }

    // delete'/notes/folder'
    static async deleteFolder(req: any, res: any) {
      const {directory} = req.body;
      const finalDir = path.join(notesDir, ...directory);
      await fs.rmdir(finalDir, {recursive:true});
  
      return {
        status: 202,
        message: 'Folder deleted'
      }
    }
  
    // delete'/notes/note'
    static async deleteNote(req: any, res: any) {
      let {directory} = req.body;

      const finalDir = path.join(notesDir, ...directory)
      await fs.rm(finalDir);
  
      return {
        status: 202,
        message: 'Note deleted'
      }
    }
}