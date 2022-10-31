import request from 'supertest';
import { closeDb, db, initMongoDB } from '../../infra/database/mongodb';
import { app } from '../../infra/http-server';
import QuestLineRepo from '../../repositories/QuestLineRepo';
import QuestRepo from '../../repositories/QuestRepo';

describe('Quests HTTP API Routes', () => {
  const dummyFinishedQuestline:any = {
    title: 'Finished questline',
    description: 'Finished questline',
    type: 'main',
    timecap: 30*24*60*60*1000
  }

  const dummyMainQuestline:any = {
    title: 'Main questline',
    description: 'Main questline',
    type: 'main',
    timecap: 30*24*60*60*1000
  }
  
  const dummyPracticeQuestline:any = {
    title: 'Practice questline',
    description: 'Practice questline',
    type: 'practice',
    timecap: null
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
    
    await QuestLineRepo.createNewQuestLine(dummyFinishedQuestline);
    await QuestLineRepo.finishMainQuestLine();

    await QuestLineRepo.createNewQuestLine(dummyMainQuestline);
    await QuestLineRepo.createNewQuestLine(dummyPracticeQuestline);

    const {records} = await QuestLineRepo.findAllActiveQuestLines();

    await QuestRepo.insertNewQuest({
      ...dummyQuest,
      questline_id: records[0]._id.toHexString()
    });
  });

  afterAll(async () => {
    await wipeCollections();
    await closeDb();
  })

  describe('/quests/questline', () => {
    test('Should respond with 200 status code and an array with 0+ questlines', async () => {
      const response = await request(app).get('/quests/questline');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(Array.isArray(response.body.body)).toBeTruthy();
    });
  });

  describe('/quests/questline/:questline_id', () => {
    test('Should respond with 200 status code and a questline uppon valid questline_id', async () => {
      const _id = (await QuestLineRepo.findMainQuestLine()).record._id.toHexString();
      const response = await request(app).get(`/quests/questline/${_id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body).toMatchObject({
        _id,
        ...dummyMainQuestline
      });
    });

    test('Should respond with 400 status code and correct message uppon invalid questline_id', async () => {
      const _id = 'invalid_id';
      const response = await request(app).get(`/quests/questline/${_id}`);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid questline_id');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/quests/questline/finish', () => {
    test('Should return 202 status code and correct message if main questline active', async () => {
      const { record } = await QuestRepo.findMainQuest();
      await QuestRepo.finishQuestTodo(record._id.toHexString(), record.todos[0].description);
      await QuestRepo.finishQuest(record._id.toHexString(), 1);
      const response = await request(app).get(`/quests/questline/finish`);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe('Questline finished');
      expect(response.body.body).toBe(null);
    });

    test('Should return 400 status code and correct message if no main questline active', async () => {
      await wipeCollections();
      const response = await request(app).get(`/quests/questline/finish`);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: No active Main Questline to be finished');
      expect(response.body.body).toBe(null);
    });

    test('Should return 400 status code and correct message if an unfineshed quest exists', async () => {
      const response = await request(app).get(`/quests/questline/finish`);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Can\'t finish, a quest is currently active');
      expect(response.body.body).toBe(null);
    });
  })

  describe('/quests/questline/all-finished', () => {
    test('Should respond with 200 status code and an array of finished questlines', async () => {
      const response = await request(app).get('/quests/questline/all-finished');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(Array.isArray(response.body.body)).toBe(true);
      response.body.body.forEach(questline => expect(questline.state).toBe('finished'));
    });
  });

  describe('/quests/questline/new', () => {
    test('Should respond with 201 status code and correct message uppon correct properties provided', async () => {
      const reqBody = {
        title: 'Practice questline 2',
        description: 'Practice questline 2',
        type: 'practice',
        timecap: null
      }
      const response = await request(app).post('/quests/questline/new').send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Questline created');
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon incorrect properties provided', async () => {
      const reqBody = {
        title: 'Practice questline 2',
        description: 'Practice questline 2',
        type: 'practice',
        //timecap: null
      }

      const response = await request(app).post('/quests/questline/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "timecap" is missing');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/quests/activeQuest', () => {
    test('Should responds 200 status code and a quest if any active', async () => {
      const response = await request(app).get('/quests/active-quest');
      const expectedQuest = {
        ...dummyQuest,
        todos: dummyQuest.todos.map(todo => ({description: todo, state: 'active', finished_at: null}))
      }

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('');
      expect(response.body.body).toMatchObject(expectedQuest);
    });
  });

  describe('/quests/quest/new', () => {
    test('Should respond with 201 status code and correct message uppon correct properties provided', async () => {
      const { record } = await QuestRepo.findMainQuest();
      await QuestRepo.finishQuestTodo(record._id.toHexString(), record.todos[0].description);
      await QuestRepo.finishQuest(record._id.toHexString(), 1);
      const questline_id = (await QuestLineRepo.findMainQuestLine()).record._id;

      const reqBody = {
        questline_id,
        title: 'Quest 2',
        description: 'Quest 2',
        type: 'main',
        todos: ['to-do 1'],
        timecap: 4*60*60*1000
      };

      const response = await request(app).post('/quests/quest/new').send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Quest created');
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code if Questline already finished', async () => {
      const { record } = await QuestRepo.findMainQuest();
      await QuestRepo.finishQuestTodo(record._id.toHexString(), record.todos[0].description);
      await QuestRepo.finishQuest(record._id.toHexString(), 1);
      const questline_id = (await QuestLineRepo.findMainQuestLine()).record._id;
      await QuestLineRepo.finishMainQuestLine();

      const reqBody = {
        questline_id,
        title: 'Quest 2',
        description: 'Quest 2',
        type: 'main',
        todos: ['to-do 1'],
        timecap: 4*60*60*1000
      };

      const response = await request(app).post('/quests/quest/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Questline already finished or invalidated');
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code if Questline no found', async () => {
      const { record } = await QuestRepo.findMainQuest();
      await QuestRepo.finishQuestTodo(record._id.toHexString(), record.todos[0].description);
      await QuestRepo.finishQuest(record._id.toHexString(), 1);

      const reqBody = {
        questline_id: '123456789123456789123456',
        title: 'Quest 2',
        description: 'Quest 2',
        type: 'main',
        todos: ['to-do 1'],
        timecap: 4*60*60*1000
      };

      const response = await request(app).post('/quests/quest/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Questline not found, verify questline_id property');
      expect(response.body.body).toBe(null);
    });
    
    test('Should respond with 400 status code and correct message uppon incorrect properties provided', async () => {
      const reqBody = {
        //questline_id: undefined,
        title: 'Quest 2',
        description: 'Quest 2',
        type: 'main',
        todos: ['to-do 1'],
        timecap: 4*60*60*1000
      };
      const response = await request(app).post('/quests/quest/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Property "questline_id" is missing');
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon correct properties provided', async () => {
      const reqBody = {
        questline_id: 'invalid_id',
        title: 'Quest 2',
        description: 'Quest 2',
        type: 'main',
        todos: ['to-do 1'],
        timecap: 4*60*60*1000
      };
      const response = await request(app).post('/quests/quest/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid questline_id');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/quests/quest/handle-todo', () => {
    test('Should respond with 202 status code and correct message uppon correct properties provided', async () => {
      const quest_id = (await QuestRepo.findMainQuest()).record._id.toHexString();
      const reqBody = {
        quest_id,
        todoDescription: dummyQuest.todos[0],
        action: 'finish'
      }
      const response = await request(app).post('/quests/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe(`To-do ${reqBody.action}`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon already finished to-do', async () => {
      const quest_id = (await QuestRepo.findMainQuest()).record._id.toHexString();
      await QuestRepo.finishQuestTodo(quest_id, dummyQuest.todos[0]);
      const reqBody = {
        quest_id,
        todoDescription: dummyQuest.todos[0],
        action: 'finish'
      }
      const response = await request(app).post('/quests/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: To-do already handled`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon incorrect properties provided', async () => {
      const reqBody = {
        //quest_id: '',
        action: 'finish',
        todoDescription: dummyQuest.todos[0]
      };
      const response = await request(app).post('/quests/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: Property "quest_id" is missing`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon invalid quest_id', async () => {
      const reqBody = {
        quest_id: 'invalid_id',
        action: 'finish',
        todoDescription: dummyQuest.todos[0]
      };
      const response = await request(app).post('/quests/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: Invalid quest_id`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon invalid todoDescription', async () => {
      const quest_id = (await QuestRepo.findMainQuest()).record._id.toHexString();
      const reqBody = {
        quest_id,
        action: 'finish',
        todoDescription: 'invalid_todo'
      }
      const response = await request(app).post('/quests/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: To-do not found, this to-do or quest may not exist`);
      expect(response.body.body).toBe(null);
    });
  });

  describe('/quests/quest/finish', () => {
    test('Should respond with 202 status code and correct message uppon correct properties', async () => {
      const quest_id = (await QuestRepo.findMainQuest()).record._id.toHexString();
      await QuestRepo.finishQuestTodo(quest_id, dummyQuest.todos[0]);
      const reqBody = {
        quest_id,
        focusScore: 10
      };
      const response = await request(app).post('/quests/quest/finish').send(reqBody);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe(`Quest finished`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon incorrect properties', async () => {
      const reqBody = {
        //quest_id,
        focusScore: 10
      };
      const response = await request(app).post('/quests/quest/finish').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: Property "quest_id" is missing`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon invalid quest_id', async () => {
      const reqBody = {
        quest_id: 'invalid_id',
        focusScore: 10
      };
      const response = await request(app).post('/quests/quest/finish').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: Invalid quest_id`);
      expect(response.body.body).toBe(null);
    });
  });

  describe('/quests/quest/distraction', () => {
    test('Should respond with 202 and correct message if active quest', async () => {
      const response = await request(app).get('/quests/quest/distraction');

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe(`Distraction score increased`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 and correct message if no active quest', async () => {
      const { record } = await QuestRepo.findMainQuest();
      await QuestRepo.finishQuestTodo(record._id.toHexString(), record.todos[0].description);
      await QuestRepo.finishQuest(record._id.toHexString(), 1);

      const response = await request(app).get('/quests/quest/distraction');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: No active quest found`);
      expect(response.body.body).toBe(null);
    });
  })
});


async function wipeCollections() {
  await db('leveling').collection('questlines').deleteMany({});
  await db('leveling').collection('quests').deleteMany({});
}