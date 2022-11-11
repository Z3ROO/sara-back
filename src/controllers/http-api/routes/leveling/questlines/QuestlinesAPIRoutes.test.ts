import request from 'supertest';
import { IQuestline } from '../../../../../features/interfaces/interfaces';
import { Quest } from '../../../../../features/Quest';
import { closeDb, db, initMongoDB } from '../../../../../infra/database/mongodb';
import { app } from '../../../../../infra/http-server';
import QuestlinesRepo from '../../../../../repositories/leveling/QuestlinesRepo';
import QuestRepo from '../../../../../repositories/QuestRepo';

describe('Quests HTTP API Routes', () => {
  const dummyFinishedQuestline: IQuestline = {
    title: 'Finished questline',
    description: 'Finished questline',
    state: 'finished',
    timecap: 132132,
    created_at: new Date(),
    finished_at: new Date(),
    xp: null
  }

  const dummyMainQuestline:any = {
    title: 'Main questline',
    description: 'Main questline',
    state: 'active',
    timecap: 132132,
    created_at: new Date(),
    finished_at: null,
    xp: null
  }

  const dummyQuest: any = {
    title: 'Quest 1',
    description: 'Quest 1',
    type: 'main',
    todos: ['to-do 1'],
    timecap: 4*60*60*1000
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await wipeCollections();
    
    await QuestlinesRepo.insertOneQuestline(dummyFinishedQuestline);
    await QuestlinesRepo.insertOneQuestline(dummyMainQuestline);

    const questline = await QuestlinesRepo.findActiveQuestline();

    await Quest.createNewQuest({
      ...dummyQuest,
      questline_id: questline!._id.toHexString()
    });
  });

  afterAll(async () => {
    await wipeCollections();
    await closeDb();
  })

  describe('get /leveling/questlines', () => {
    test('Should respond with 200 status code and the active questline if has one', async () => {
      const response = await request(app).get('/leveling/questlines');
      const dummyQuestline = {
        ...dummyMainQuestline
      }
      delete dummyQuestline.created_at;
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body).toMatchObject(dummyQuestline);
    });

    test('Should respond with 400 status code and correct message if no active questline', async () => {
      await wipeCollections();

      const response = await request(app).get('/leveling/questlines');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: No active questline found');
      expect(response.body.body).toBe(null);
    });
  });

  describe('get /leveling/questlines/all', () => {
    test('Should respond with 200 status code and all existing questlines', async () => {
      const response = await request(app).get('/leveling/questlines/all');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body.length).toBe(2);
    });
  });

  describe('get /leveling/questlines/all-finished', () => {
    test('Should respond with 200 status code and an array of finished questlines', async () => {
      const response = await request(app).get('/leveling/questlines/all-finished');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(Array.isArray(response.body.body)).toBe(true);
      response.body.body.forEach(questline => expect(questline.state).toBe('finished'));
    });
  });

  describe('post /leveling/questlines/new', () => {
    test('Should respond with 201 status code and correct message uppon correct properties provided', async () => {
      const quest = (await QuestRepo.findActiveMainQuest())!;
      await QuestRepo.finishQuestTodo(quest._id.toHexString(), quest.todos[0].description);
      await QuestRepo.finishQuest(quest._id.toHexString(), 1);
      await QuestlinesRepo.terminateActiveQuestline('finished');

      const reqBody = {
        title: 'Practice questline 2',
        description: 'Practice questline 2',
        timecap: null
      }
      const response = await request(app).post('/leveling/questlines/new').send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Questline created');
      expect(response.body.body).toBe(null);
    });

    describe('get /leveling/questlines/finish OR invalidate', () => {
      test('Should return 202 status code and correct message if main questline active', async () => {
        const quest = (await QuestRepo.findActiveMainQuest())!;
        await QuestRepo.finishQuestTodo(quest._id.toHexString(), quest.todos[0].description);
        await QuestRepo.finishQuest(quest._id.toHexString(), 1);
        const response = await request(app).get(`/leveling/questlines/finish`);
  
        expect(response.status).toBe(202);
        expect(response.body.status).toBe(202);
        expect(response.body.message).toBe('Questline finished');
        expect(response.body.body).toBe(null);
      });
  
      test('Should return 400 status code and correct message if no questline active', async () => {
        await wipeCollections();
        const response = await request(app).get(`/leveling/questlines/finish`);
  
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('Bad Request: No active Main Questline to be finished');
        expect(response.body.body).toBe(null);
      });
  
      test('Should return 400 status code and correct message if an unfineshed quest exists', async () => {
        const response = await request(app).get(`/leveling/questlines/finish`);
  
        expect(response.status).toBe(400);
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBe('Bad Request: Can\'t finish, a quest is currently active');
        expect(response.body.body).toBe(null);
      });
    });

    test('Should respond with 400 status code and correct message uppon incorrect properties provided', async () => {
      const reqBody = {
        title: 'Practice questline 2',
        description: 'Practice questline 2',
        type: 'practice',
        //timecap: null
      }

      const response = await request(app).post('/leveling/questlines/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "timecap" is missing');
      expect(response.body.body).toBe(null);
    });
  });  

  describe('get /leveling/questlines/:questline_id', () => {
    test('Should respond with 200 status code and a questline uppon valid questline_id', async () => {
      const _id = (await QuestlinesRepo.findActiveQuestline())!._id.toHexString();
      const response = await request(app).get(`/leveling/questlines/${_id}`);
      
      const dummyQuestline = {
        ...dummyMainQuestline
      }
      delete dummyQuestline.created_at;

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body).toMatchObject({
        _id,
        ...dummyQuestline
      });
    });

    test('Should respond with 400 status code and correct message uppon invalid questline_id', async () => {
      const _id = 'invalid_id';
      const response = await request(app).get(`/leveling/questlines/${_id}`);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid questline_id');
      expect(response.body.body).toBe(null);
    });
  });

  describe('delete /leveling/questlines/:questline_id', () => {
    test('Should respond with 202 status code and correct message uppon valid questline_id', async () => {
      const _id = (await QuestlinesRepo.findActiveQuestline())!._id.toHexString();

      const response = await request(app).delete(`/leveling/questlines/${_id}`);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Questline deleted');
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon invalid questline_id', async () => {
      const response = await request(app).delete('/leveling/questlines/invalid_id')
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid questline_id');
      expect(response.body.body).toBe(null);
    });
  });
});


async function wipeCollections() {
  await QuestlinesRepo.wipeCollection();
  await QuestRepo.wipeCollection();
}