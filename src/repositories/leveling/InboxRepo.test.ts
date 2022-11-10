import { closeDb, initMongoDB } from '../../infra/database/mongodb'
import InboxRepo from './InboxRepo';

describe('Inbox Repository', () => {
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

  test('Should successfully retrieve all raw inbox items', async () => {
    const items = await InboxRepo.findRawInboxItems();

    expect(items.length).toBe(3)
    items.forEach(item => expect(item).toMatchObject(rawInboxItem01))
  });

  test('Should successfully retrieve all reviewed inbox items', async () => {
    const items = await InboxRepo.findReviewedInboxItems();

    expect(items.length).toBe(3)
    items.forEach(item => expect(item).toMatchObject(reviewedInboxItem01))
  });

  test('Should successfully retrieve all inbox items', async () => {
    const items = await InboxRepo.findAllInboxItems();

    expect(items.length).toBe(6);
  });

  test('Should successfully retrieve one inbox item', async () => {
    const item_id = (await InboxRepo.findRawInboxItems())[0]._id.toHexString();
    const item = await InboxRepo.findOneInboxItem(item_id);
    
    expect(item).toMatchObject(rawInboxItem01);
  });

  test('Should successfully insert one Inbox Item', async () => {
    InboxRepo.wipeCollection();
    const inboxItem = {
      content: 'Dummy inbox',
      reviewed: false,
      nextReview: new Date()
    }
    await InboxRepo.insertNewInboxItem(inboxItem);
    const item = (await InboxRepo.findAllInboxItems())[0]
    
    expect(item).toMatchObject(inboxItem)
  });

  test('Should successfully update one inbox item', async () => {
    const item_id = (await InboxRepo.findAllInboxItems())[0]._id.toHexString();
    await InboxRepo.updateOneInboxItem(item_id, {content: 'Updated Inbox'});
    const updatedItem = await InboxRepo.findOneInboxItem(item_id);
    
    expect(updatedItem!.content).toBe('Updated Inbox');
  });

  test('Should successfully delete one inbox item', async () => {
    const item_id = (await InboxRepo.findAllInboxItems())[0]._id.toHexString();
    await InboxRepo.deleteOneInboxItem(item_id);
    const deletedItem = await InboxRepo.findOneInboxItem(item_id);
    
    expect(deletedItem).toBe(null);
  });
});
