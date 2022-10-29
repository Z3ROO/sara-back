import { app } from '../../infra/http-server/index';
import request from 'supertest';
import { initMongoDB, db, closeDb } from '../../infra/database/mongodb';
import RecordsRepo from '../../repositories/RecordsRepo';
import { IRecords } from '../../features/interfaces/interfaces';

describe('Records Route', () => {
  const dummyRecord: Partial<IRecords> = {
    questline_id: 'questlineid',
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
    RecordsRepo.insertOneRecord(dummyRecord);
  });

  afterAll(async () => {
    await db('leveling').collection('records').deleteMany({});
    await closeDb();
  });

  describe('/records', () => {
    test('Should respond 200', async () => {
      const response = await request(app).get('/records').set('Accept', 'application/json');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(200);
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
        xp: 50
      }
      const response = await request(app).get('/records');
      expect(response.body.body[0]).toMatchObject(hidratedDummyRecord)
    });
  });

  describe('/records/up/:record_id', () => {
    test('Should responds with 202 status code uppon correct record_id', async () => {
      const { records } = await RecordsRepo.findAllRecords();
      const _id = records[0]._id;
    
      const response = await request(app).get(`/records/up/${_id}`);
      expect(response.statusCode).toBe(202);
      expect(response.body.status).toBe(202);
    });

    test('Should responds with 400 status code uppon incorrect record_id', async () => {    
      const response = await request(app).get(`/records/up/invalid_id`);
      
      expect(response.body.message).toBe('');
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe(400);
    });
  });

  describe('/records/new', () => {
    test('Should respond with 201 status code uppon correct properties provided', async () => {
      const requestBody = {
        questline_id: 'questlineid',
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
    });

    test('Should respond with 400 status code uppon incorrect properties provided', async () => {
      const requestBody = {
        questline_id: 'questlineid',
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
      expect(response.body.message).toBe('');
    });
  })
})
