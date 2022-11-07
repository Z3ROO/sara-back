import request from 'supertest';
import { closeDb, initMongoDB, db } from '../../../../../infra/database/mongodb';
import { app } from '../../../../../infra/http-server/index';
import PillsRepo from '../../../../../repositories/PillsRepo';

describe('Pills HTTP API Routes', () => {
  const dummyPill = {
    name: 'pill 01',
    description: 'pill description'
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await db('leveling').collection('pills').deleteMany({});
    await PillsRepo.insertOnePill(dummyPill);
  })

  afterAll(async () => {
    await db('leveling').collection('pills').deleteMany({});
    await closeDb();
  });

  describe('/pills', () => {
    test('Should respond with 200 status code and array of pills if any to take', async () => {
      const response = await request(app).get('/pills');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('')
      expect(response.body.body[0]).toMatchObject(dummyPill);
    });
  });

  describe('/pills/all', () => {
    test('Should respond with 200 status code and array of all existing pills if any', async () => {
      const response = await request(app).get('/pills/all');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('')
      expect(response.body.body[0]).toMatchObject(dummyPill);
    });
  });

  describe('/pills/take/:pill_id', () => {
    test('Should respond with 202 status code and correct message uppon valid pill_id', async () => {

      const pill_id = (await PillsRepo.findAllPills())[0]._id
      const response = await request(app).get('/pills/take/'+pill_id);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Pill taken')
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon invalid pill_id', async () => {
      const pill_id = 'invalid_id'
      const response = await request(app).get('/pills/take/'+pill_id);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid pill_id');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/pills/new', () => {
    test('Should respond with 201 status code and correct message uppon valid properties', async () => {
      const pill = {
        name: 'pill 02',
        description: 'pill description'
      }
      const response = await request(app).post('/pills/new').send(pill);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Pill added')
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon valid properties', async () => {
      const pill = {
        //name: 'pill 02',
        description: 'pill description'
      }
      const response = await request(app).post('/pills/new').send(pill);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "name" is missing')
      expect(response.body.body).toBe(null);
    });
  });
})