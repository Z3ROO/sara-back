import { closeDb, initMongoDB } from "../../../../../infra/database/mongodb";
import SkillsRepo from '../../../../../repositories/leveling/SkillsRepo';
import { Skills } from '../../../../../features/leveling/Skills';
import request from 'supertest';
import { app } from '../../../../../infra/http-server/index';

describe('Skills Repositories', () => {
  const dummySkill01 = {
    name: 'skill 01',
    description: 'Description of one skill',
    created_at: new Date(),
  }

  const dummySkill02 = {
    ...dummySkill01,
    name: 'skill 02'
  }

  const dummySkill03 = {
    ...dummySkill01,
    name: 'skill 03'
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await SkillsRepo.wipeCollection();
    await SkillsRepo.insertOneSkill(dummySkill01);
    await SkillsRepo.insertOneSkill(dummySkill02);
    await SkillsRepo.insertOneSkill(dummySkill03);
  });

  afterAll(async () => {
    await closeDb();
  });

  describe('get /leveling/skills', () => {
    test('Should response 200 status code with all existing skills', async () => {
      const response = await request(app).get('/leveling/skills');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body.length).toBe(3);
    });
  });

  describe('get /leveling/skills/:skill_id', () => {
    test('Should response 200 status code with one specified skills', async () => {
      const skill_id = (await Skills.getAllSkills())![0]._id.toHexString();
      const response = await request(app).get('/leveling/skills/'+skill_id);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body.name).toBe(dummySkill01.name);
    });
    
    test('Should responde 400 status code and correct message uppon invalid skill_id ', async () => {
      const skill_id = 'invalid_id';
      const response = await request(app).get('/leveling/skills/'+skill_id);
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid skill_id');
      expect(response.body.body).toBe(null);
    });
  });

  describe('post /leveling/skills/new', () => {
    test('Should respond 201 status code uppon successfully create a new skill', async () => {
      const dummySkill = {
        name: 'Skill',
        description: 'Description'
      }
      const response = await request(app).post('/leveling/skills/new').send(dummySkill);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Skill created');
      expect(response.body.body).toBe(null);
    });
    
    test('Should throw Bad Request if try to insert already existing skill name', async () => {
      const dummySkill = {
        name: 'skill 01',
        description: 'Description'
      }
      const response = await request(app).post('/leveling/skills/new').send(dummySkill);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Requests: Skill name chosen already exists');
      expect(response.body.body).toBe(null);
    });
  });

  describe('delete /leveling/skills/:skill_id', () => {
    test('Should respond 202 status code when delete skill', async () => {
      const skill_id = (await Skills.getAllSkills())![0]._id.toHexString();
      const response = await request(app).delete('/leveling/skills/'+skill_id)
  
      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Skill deleted');
      expect(response.body.body).toBe(null);
    });
  
    test('Should respond 400 status code and correct message uppon invalide skill_id ', async () => {
      const skill_id = 'invalid_id';
      const response = await request(app).delete('/leveling/skills/'+skill_id)
  
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid skill_id');
      expect(response.body.body).toBe(null);
    });
  })

})