import { Dirent } from 'fs';
import fs from 'fs/promises';
import path from 'path';

const notesDir = path.join(__dirname, '../../../../notes/');

export default class NotesAPIHandlers {
  // get'/notes/tree-listing/:category'
  static async getTreeListing(req: any, res: any) {
    const { category } = req.params;

    console.log(req.params)

    const listing = [await NotesAPIHandlers.buildListing([category])]

    res.json({
      status: 'ok',
      err: '',
      body: listing
    })
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

    res.json({
      status: 'ok',
      err: '',
      body: fileContent
    })
  }

  // get'/notes'
  static async getCategories(req: any, res: any) {
    const categories = await fs.readdir(notesDir);
  
    res.json(categories);
  }

  //get'/notes/:category/content', 
  static async getNotebooks(req, res) {
    const { category } = req.params;
    const categoryDir = path.join(notesDir, category);

    const notebooks = await fs.readdir(categoryDir);
    
    res.json(notebooks);
  }

  //get'/notes/:category/:notebook/content'
  static async getSections(req, res) {
    const { category, notebook } = req.params;
  
    const notebookDir = path.join(notesDir, category, notebook)
  
    const sections = await fs.readdir(notebookDir);
  
    res.json(sections);
  }

  //post'/notes/:category/:notebook/section/content'
  static async getSectionSections(req, res) {
    const { category, notebook } = req.params;
    const { section } = req.body;
  
    const sectionDir = path.join(notesDir, category, notebook, section);
  
    const pages = await fs.readdir(sectionDir);
    
    res.json(pages);
  }

  //post'/notes/:category/:notebook/section/page'
  static async getPage(req, res) {
    const { category, notebook } = req.params;
    const { section, page } = req.body;
    console.log(section)
    const pageDir = path.join(notesDir, category, notebook, section, page);
  
    const pageContent = await fs.readFile(pageDir, 'utf-8');
  
    res.json(pageContent)
  }

  //post'/notes/:category/new-notebook'
  static async createNewNotebook(req, res) {
    const { category } = req.params;
    const { name } = req.body;
  
    const newNotebookDir = path.join(notesDir, category, name);
  
    await fs.mkdir(newNotebookDir, { recursive: true });
  
    res.json({ok: true});
  }

  //post'/notes/new-section'
  static async createNewSection(req, res) {
    const { name, pathDir } = req.body;
  
    const newSectionDir = path.join(notesDir, pathDir, name);
    console.log(newSectionDir)
    await fs.mkdir(newSectionDir, { recursive: true });
  
    res.json({ok: true});
  }

  //post'/notes/new-page'
  static async createNewPage(req, res) {
    let { name, pathDir } = req.body;
  
    if (!name.match(/\.md$/)) name = name+'.md'
    
    const newPageDir = path.join(notesDir, pathDir, name);
  
    await fs.writeFile(newPageDir, '', 'utf-8');
  
    res.json({ok: true});
  }

  //put'/notes/:category/:notebook/section/page/save'
  static async savePage(req, res) {
    const { category, notebook } = req.params;
    const { content, section, page } = req.body;
  
    const newPageDir = path.join(notesDir, category, notebook, section, page);
  
    await fs.writeFile(newPageDir, content, 'utf-8');
  
    res.json({ok: true});
  }

  //delete'/notes/:category/:notebook/notebook/delete'
  static async deleteNotebook(req, res) {
    const { category, notebook } = req.params;
  
    fs.rmdir(path.join(notesDir,category, notebook), {recursive:true})
  
    res.json({ok:true})
  }
  
  //delete'/notes/:category/:notebook/section/delete'
  static async deleteSection(req, res) {
    const { section } = req.body
    
    const { category, notebook } = req.params;
    fs.rmdir(path.join(notesDir,category, notebook, section), {recursive:true})
  
    res.json({ok:true})
  }
  
  //delete'/notes/:category/:notebook/page/delete'
  static async deletePage(req, res) {
    const { category, notebook } = req.params;
    const { section, page } = req.body
  
    fs.rm(path.join(notesDir,category, notebook, section, page))
  
    res.json({ok:true})
  }
}