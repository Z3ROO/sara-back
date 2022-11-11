import { initMongoDB, closeDb } from "../../../../../infra/database/mongodb";
import InboxRepo from "../../../../../repositories/leveling/InboxRepo";
import request from 'supertest';
import {app} from '../../../../../infra/http-server/index';


describe('Inbox HTTP API Routes', () => {
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

  describe('/leveling/inbox', () => {
    test('Should respond 200 status code and return all existing Inbox items', async () => {
      const response = await request(app).get('/leveling/inbox');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body.length).toBe(6);
      response.body.body.forEach((item:any) => expect(item.content).toBe(rawInboxItem01.content));
    });
  })

  describe('/leveling/inbox/raw', () => {
    test('Should respond 200 status code and return all raw Inbox items', async () => {
      const response = await request(app).get('/leveling/inbox/raw');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body.length).toBe(3);
      response.body.body.forEach((item:any) => expect(item.content).toBe(rawInboxItem01.content));
    });
  })

  describe('/leveling/inbox/reviewed', () => {
    test('Should respond 200 status code and return all reviewed Inbox items', async () => {
      const response = await request(app).get('/leveling/inbox/reviewed');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body.length).toBe(3);
      response.body.body.forEach((item:any) => expect(item.content).toBe(rawInboxItem01.content));
    });
  });

  describe('/leveling/inbox/new', () => {
    test('Should respond 202 status code and correct message uppon valid properties', async () => {
      const content = 'Inbox content';
      const response = await request(app).post('/leveling/inbox/new').send({content});

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Inbox item created');
      expect(response.body.body).toBe(null);
    });

    test('Should respond 400 status code and correct message uppon invalid properties', async () => {
      const response = await request(app).post('/leveling/inbox/new').send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "content" is missing');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/leveling/inbox/review/:_id', () => {
    test('Should respond 202 status code and correct message uppon valid properties', async () => {
      const inbox_item_id = (await InboxRepo.findRawInboxItems())[0]._id.toHexString();
      const content = 'Inbox content';
      const response = await request(app).post('/leveling/inbox/review/'+inbox_item_id).send({content});

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Inbox item reviewed');
      expect(response.body.body).toBe(null);
    });

    test('Should respond 400 status code and correct message uppon invalid inbox_item_id', async () => {
      const inbox_item_id = 'invalid_id';
      const content = 'Inbox content';
      const response = await request(app).post('/leveling/inbox/review/'+inbox_item_id).send({content});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid inbox_item_id');
      expect(response.body.body).toBe(null);
    });

    test('Should respond 400 status code and correct message uppon invalid properties', async () => {
      const inbox_item_id = (await InboxRepo.findRawInboxItems())[0]._id.toHexString();
      const response = await request(app).post('/leveling/inbox/review/'+inbox_item_id).send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "content" is missing');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/leveling/inbox/defer/:_id', () => {
    test('Should respond 202 status code and correct message uppon valid properties', async () => {
      const inbox_item_id = (await InboxRepo.findRawInboxItems())[0]._id.toHexString();
      const content = 'Inbox content';
      const response = await request(app).post('/leveling/inbox/defer/'+inbox_item_id).send({content});

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Inbox item defered');
      expect(response.body.body).toBe(null);
    });

    test('Should respond 400 status code and correct message uppon invalid inbox_item_id', async () => {
      const inbox_item_id = 'invalid_id';
      const content = 'Inbox content';
      const response = await request(app).post('/leveling/inbox/defer/'+inbox_item_id).send({content});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid inbox_item_id');
      expect(response.body.body).toBe(null);
    });

    test('Should respond 400 status code and correct message uppon invalid properties', async () => {
      const inbox_item_id = (await InboxRepo.findRawInboxItems())[0]._id.toHexString();
      const response = await request(app).post('/leveling/inbox/defer/'+inbox_item_id).send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "content" is missing');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/leveling/inbox/:_id', () => {
    test('Should respond 202 status code and correct message uppon valid properties', async () => {
      const inbox_item_id = (await InboxRepo.findRawInboxItems())[0]._id.toHexString();
      const response = await request(app).delete('/leveling/inbox/'+inbox_item_id);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Inbox item deleted');
      expect(response.body.body).toBe(null);
    });

    test('Should respond 400 status code and correct message uppon invalid inbox_item_id', async () => {
      const inbox_item_id = 'invalid_id';
      const response = await request(app).delete('/leveling/inbox/'+inbox_item_id);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid inbox_item_id');
      expect(response.body.body).toBe(null);
    });
  });
})