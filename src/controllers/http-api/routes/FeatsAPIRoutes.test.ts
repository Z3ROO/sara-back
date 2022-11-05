import request from 'supertest';
import { Feats } from '../../../features/Feats';
import { IFeats, INewFeat } from '../../../features/interfaces/interfaces';
import { closeDb, db, initMongoDB } from '../../../infra/database/mongodb';
import { app } from '../../../infra/http-server';
import FeatsRepo from '../../../repositories/FeatsRepo';

describe('Feats HTTP API Routes', () => {
  const dummyFeat: INewFeat = {
    questline_id: '123456789123456789123456',
    title: 'Feat 01',
    description: 'Feat 01',
    todos: null,
    categories: ['some_category'],
    tier: 0
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await db('leveling').collection('feats').deleteMany({});
    Feats.createNewFeat(dummyFeat);
  });

  afterAll(async () => {
    await db('leveling').collection('feats').deleteMany({});
    await closeDb();
  });

  describe('/feats', () => {
    test('Should respond with 200 status code', async () => {
      const response = await request(app).get('/feats')

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
    })

    test('Should respond with body containing array of Feats', async () => {
      const hidratedDummyFeat = {
        ...dummyFeat,
        acceptance: {
          stage: 'created'
        },
        completed: false,
        xp: dummyFeat.tier*50,
        finished_at: null
      }

      const response = await request(app).get('/feats');

      expect(response.body.body[0]).toMatchObject(hidratedDummyFeat);
    })
  })

  describe('/feats/complete/:feat_id', () => {
    test('Should respond with 202 status code and correct message uppon valid feat_id', async () => {
      const feat = (await FeatsRepo.findAllFeats())[0];
      const response = await request(app).get(`/feats/complete/${feat._id}`);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe(`Feat completed`);
    });

    test('Should respond with 400 status code and correct message uppon invalid feat_id', async () => {
      const response = await request(app).get('/feats/complete/invalid_id');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid feat_id');
    });
  })

  describe('/feats/new', () => {
    test('Should reponds 201 status code and correct uppon correct properties provided', async () => {
      const requestBody = {
        questline_id: '123456789123456789123456',
        title: 'Feat 02',
        description: 'Feat 02',
        todos: null,
        categories: 'null',
        tier: 1
      }
      
      const response = await request(app).post('/feats/new').send(requestBody);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Feat created');
    });

    test('Should respond with 400 status code and correct message uppon missing property', async () => {
      const requestBody = {
        questline_id: '123456789123456789123456',
        title: 'Feat 03',
        description: 'Feat 03',
        todos: null,
        categories: 'null',
        //tier: 1
      }

      const response = await request(app).post('/feats/new').send(requestBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "tier" is missing');
    });

    test('Should respond with 400 status code and correct message uppon invalid questline_id', async () => {
      const requestBody = {
        questline_id: 'invalid_id',
        title: 'Feat 03',
        description: 'Feat 03',
        todos: null,
        categories: 'null',
        tier: 1
      }

      const response = await request(app).post('/feats/new').send(requestBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid questline_id');
    })
  })
})