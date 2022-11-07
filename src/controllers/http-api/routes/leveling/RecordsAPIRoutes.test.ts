import { app } from '../../../infra/http-server/index';
import request from 'supertest';
import { initMongoDB, db, closeDb } from '../../../infra/database/mongodb';
import RecordsRepo from '../../../repositories/RecordsRepo';
import { INewRecord, IRecords } from '../../../features/interfaces/interfaces';
import { Records } from '../../../features/Records';

describe('Records HTTP API Routes', () => {
  const dummyRecord: INewRecord = {
    questline_id: '123456789123456789123456',
    title: 'Record 01',
    description: 'Record 01',
    metric: 'unit',
    status: {
      stageAmount: 4,
      waitTime: 7*24*60*60*1000
    },
    categories: [`some-category`]
  }

  beforeAll(async () => {
    await initMongoDB();
    Records.createNewRecord(dummyRecord);
  });

  afterAll(async () => {
    await db('leveling').collection('records').deleteMany({});
    await closeDb();
  });

  describe('/records', () => {
    test('Should respond 200', async () => {
      const response = await request(app).get('/records');

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
    });

    test('Should respond with one or more Record', async () => {
      const hidratedDummyRecord = {
        ...dummyRecord,
        acceptance: {
          stage: 'created'
        },
        status: {
          stage: null,
          last_commitment: null,
          ...dummyRecord.status
        },
        level: 0,
        history: [],
        xp: null
      }
      const response = await request(app).get('/records');
      expect(response.body.body[0]).toMatchObject(hidratedDummyRecord);
    });
  });

  describe('/records/up/:record_id', () => {
    test('Should responds with 202 status code and correct message uppon valid record_id', async () => {
      const records = await RecordsRepo.findAllRecords();
      const _id = records[0]._id;
    
      const response = await request(app).get(`/records/up/${_id}`);
      expect(response.statusCode).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Record level updated')
    });

    test('Should responds with 400 status code uppon invalid record_id', async () => {    
      const response = await request(app).get(`/records/up/invalid_id`);
      
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid record_id');
    });
  });

  describe('/records/new', () => {
    test('Should respond with 201 status code and correct message uppon correct properties provided', async () => {
      const requestBody = {
        questline_id: '123456789123456789123456',
        title: 'Record 02',
        description: 'Record 02',
        metric: 'unit',
        stageAmount: 4,
        waitTime: 7*24*60*60*1000,
        categories: [`some-category`]
      };

      const response = await request(app).post(`/records/new`).send(requestBody);

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Record created');
    });

    test('Should respond with 400 status code and correct message uppon incorrect properties provided', async () => {
      const requestBody = {
        questline_id: '123456789123456789123456',
        title: 'Record 02',
        description: 'Record 02',
        metric: 'unit',
        stageAmount: 4,
        waitTime: 7*24*60*60*1000,
        //categories: [`some-category`]
      };

      const response = await request(app).post(`/records/new`).send(requestBody);
      
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "categories" is missing');
    });

    test('Should respond with 400 status code and correct message uppon invalid questline_id provided', async () => {
      const requestBody = {
        questline_id: 'invalid_questline_id',//less than 24 characters
        title: 'Record 02',
        description: 'Record 02',
        metric: 'unit',
        stageAmount: 4,
        waitTime: 7*24*60*60*1000,
        categories: [`some-category`]
      };

      const response = await request(app).post(`/records/new`).send(requestBody);
      
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid questline_id');
    });
  })
})
