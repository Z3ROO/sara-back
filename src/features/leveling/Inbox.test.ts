import { initMongoDB, closeDb } from "../../infra/database/mongodb";
import InboxRepo from "../../repositories/leveling/InboxRepo";
import { BadRequest } from "../../util/errors/HttpStatusCode";
import Inbox from './Inbox';

describe('Inbox Busines Logic', () => {
  const rawInboxItem01 = {
    content: 'Inbox',
    reviewed: false,
    nextReview: new Date()
  }

  const rawInboxItem02 = {
    ...rawInboxItem01
  }

  const rawInboxItem03 = {
    ...rawInboxItem01
  }

  const reviewedInboxItem01 = {
    ...rawInboxItem01,
    reviewed: true
  }

  const reviewedInboxItem02 = {
    ...rawInboxItem01,
    reviewed: true
  }
  const reviewedInboxItem03 = {
    ...rawInboxItem01,
    reviewed: true
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await InboxRepo.wipeCollection();
    await InboxRepo.insertNewInboxItem(rawInboxItem01);
    await InboxRepo.insertNewInboxItem(rawInboxItem02);
    await InboxRepo.insertNewInboxItem(rawInboxItem03);
    await InboxRepo.insertNewInboxItem(reviewedInboxItem01);
    await InboxRepo.insertNewInboxItem(reviewedInboxItem02);
    await InboxRepo.insertNewInboxItem(reviewedInboxItem03);
  });

  afterAll(async () => {
    await InboxRepo.wipeCollection();
    await closeDb();
  });

  test('Should successfully return all raw inbox items', async () => {
    const items = await Inbox.getRawInbox();

    expect(items.length).toBe(3)
    items.forEach(item => expect(item).toMatchObject(rawInboxItem01))
  });

  test('Should successfully return all reviewed inbox items', async () => {
    const items = await Inbox.getReviewedInbox();

    expect(items.length).toBe(3)
    items.forEach(item => expect(item).toMatchObject(reviewedInboxItem01))
  });

  test('Should successfully return all inbox items', async () => {
    const items = await Inbox.getInbox();

    expect(items.length).toBe(6);
  });

  test('Should successfully return one inbox item', async () => {
    const item_id = (await InboxRepo.findRawInboxItems())[0]._id.toHexString();
    const item = await Inbox.getOneInboxItem(item_id);
    
    expect(item).toMatchObject(rawInboxItem01);
  });

  test('Should throw Bad Request if invalid _id when trying to get one inbox item', async () => {
    const getItem = async () => await Inbox.getOneInboxItem('invalid_id');
    
    await expect(getItem).rejects.toThrow(new BadRequest('Invalid inbox_item_id'));
  });

  test('Should successfully add a new Inbox Item', async () => {
    InboxRepo.wipeCollection();
    const inboxItem = {
      content: 'Dummy inbox',
      reviewed: false
    }
    await Inbox.addNewInboxItem(inboxItem.content);
    const item = (await InboxRepo.findAllInboxItems())[0];
    
    expect(item).toMatchObject(inboxItem)
  });

  test('Should throw Bad Request if invalid/missing properties when trying to add one inbox item', async () => {
    const content: any = undefined;
    const addItem = async () => await Inbox.addNewInboxItem(content);
    
    await expect(addItem).rejects.toThrow(new BadRequest('Property "content" is missing'));
  });

  test('Should successfully defer and update content of inbox item', async () => {
    const item_id = (await InboxRepo.findAllInboxItems())[0]._id.toHexString();
    const content = 'New content for defered inbox item';
    await Inbox.deferInboxItem(item_id, content);
    const deferedItem = await Inbox.getOneInboxItem(item_id);

    expect(deferedItem!.content).toBe(content);
    expect(deferedItem!.nextReview.getTime()).toBeGreaterThan(Date.now()+(11*60*60*1000));
  });

  test('Should throw Bad Request if invalid _id when trying to defer one inbox item', async () => {
    const deferItem = async () => await Inbox.deferInboxItem('invalid_id', 'content');
    
    await expect(deferItem).rejects.toThrow(new BadRequest('Invalid inbox_item_id'));
  });

  test('Should throw Bad Request if invalid/missing properties when trying to defer one inbox item', async () => {
    const content: any = undefined;
    const deferItem = async () => await Inbox.deferInboxItem('123456789123456789123456', content);
    
    await expect(deferItem).rejects.toThrow(new BadRequest('Property "content" is missing'));
  });

  test('Should successfully review and update content of inbox item', async () => {
    const item_id = (await InboxRepo.findAllInboxItems())[0]._id.toHexString();
    const content = 'New content for reviewed inbox item';
    await Inbox.reviewInboxItem(item_id, content);
    const reviewedItem = await Inbox.getOneInboxItem(item_id);

    expect(reviewedItem!.content).toBe(content);
    expect(reviewedItem!.nextReview.getTime()).toBeGreaterThan(Date.now()-(60*1000));
  });

  test('Should throw Bad Request if invalid _id when trying to review one inbox item', async () => {
    const reviewItem = async () => await Inbox.reviewInboxItem('invalid_id', 'content');
    
    await expect(reviewItem).rejects.toThrow(new BadRequest('Invalid inbox_item_id'));
  });

  test('Should throw Bad Request if invalid/missing properties when trying to review one inbox item', async () => {
    const content: any = undefined;
    const reviewItem = async () => await Inbox.reviewInboxItem('123456789123456789123456', content);
    
    await expect(reviewItem).rejects.toThrow(new BadRequest('Property "content" is missing'));
  });

  test('Should successfully delete one inbox item', async () => {
    const item_id = (await InboxRepo.findAllInboxItems())[0]._id.toHexString();
    await Inbox.deleteInboxItem(item_id);
    const deletedItem = await Inbox.getOneInboxItem(item_id);
    
    expect(deletedItem).toBe(null);
  });

  test('Should throw Bad Request if invalid _id when trying to delete one inbox item', async () => {
    const deleteItem = async () => await Inbox.deleteInboxItem('invalid_id');
    
    await expect(deleteItem).rejects.toThrow(new BadRequest('Invalid inbox_item_id'));
  });
})