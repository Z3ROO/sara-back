import { app } from '../../infra/http-server/index';
import request from 'supertest';
import { initMongoDB } from '../../infra/database/mongodb';

describe('describe', () => {
  beforeAll(async () => {
    await initMongoDB(()=> {})
  })
  test('test', async () => {
    
    const response = await request(app).get('/quests/questline').set('Accept', 'application/json');
    console.log(response.body)
  })
})
