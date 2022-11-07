import request from 'supertest';
import { IQuestline } from '../../../../../features/interfaces/interfaces';
import { Quest } from '../../../../../features/Quest';
import { closeDb, db, initMongoDB } from '../../../../../infra/database/mongodb';
import { app } from '../../../../../infra/http-server';
import QuestlineRepo from '../../../../../repositories/QuestlineRepo';
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
    
    await QuestlineRepo.insertOneQuestline(dummyFinishedQuestline);

    await QuestlineRepo.insertOneQuestline(dummyMainQuestline);

    const questline = await QuestlineRepo.findActiveQuestline();

    await Quest.createNewQuest({
      ...dummyQuest,
      questline_id: questline!._id.toHexString()
    });
  });

  afterAll(async () => {
    await wipeCollections();
    await closeDb();
  })

  describe('/leveling/activeQuest', () => {
    test('Should responds 200 status code and a quest if any active', async () => {
      const response = await request(app).get('/leveling/active-quest');
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

  describe('/leveling/quest/new', () => {
    test('Should respond with 201 status code and correct message uppon correct properties provided', async () => {
      const quest = (await QuestRepo.findActiveMainQuest())!;
      await QuestRepo.finishQuestTodo(quest._id.toHexString(), quest.todos[0].description);
      await QuestRepo.finishQuest(quest._id.toHexString(), 1);
      const questline_id = (await QuestlineRepo.findActiveQuestline())!._id;

      const reqBody = {
        questline_id,
        title: 'Quest 2',
        description: 'Quest 2',
        type: 'main',
        todos: ['to-do 1'],
        timecap: 4*60*60*1000
      };

      const response = await request(app).post('/leveling/quest/new').send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(201);
      expect(response.body.message).toBe('Quest created');
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code if Questline no found', async () => {
      const quest = (await QuestRepo.findActiveMainQuest())!;
      await QuestRepo.finishQuestTodo(quest._id.toHexString(), quest.todos[0].description);
      await QuestRepo.finishQuest(quest._id.toHexString(), 1);

      const reqBody = {
        questline_id: '123456789123456789123456',
        title: 'Quest 2',
        description: 'Quest 2',
        type: 'main',
        todos: ['to-do 1'],
        timecap: 4*60*60*1000
      };

      const response = await request(app).post('/leveling/quest/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Issued questline_id does not match with current Questline');
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
      const response = await request(app).post('/leveling/quest/new').send(reqBody);

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
      const response = await request(app).post('/leveling/quest/new').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Bad Request: Invalid questline_id');
      expect(response.body.body).toBe(null);
    });
  });

  describe('/leveling/quest/handle-todo', () => {
    test('Should respond with 202 status code and correct message uppon correct properties provided', async () => {
      const quest_id = (await QuestRepo.findActiveMainQuest())!._id.toHexString();
      const reqBody = {
        quest_id,
        todoDescription: dummyQuest.todos[0],
        action: 'finish'
      }
      const response = await request(app).post('/leveling/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe(`To-do ${reqBody.action}`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon already finished to-do', async () => {
      const quest_id = (await QuestRepo.findActiveMainQuest())!._id.toHexString();
      await QuestRepo.finishQuestTodo(quest_id, dummyQuest.todos[0]);
      const reqBody = {
        quest_id,
        todoDescription: dummyQuest.todos[0],
        action: 'finish'
      }
      const response = await request(app).post('/leveling/quest/handle-todo').send(reqBody);

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
      const response = await request(app).post('/leveling/quest/handle-todo').send(reqBody);

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
      const response = await request(app).post('/leveling/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: Invalid quest_id`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 status code and correct message uppon invalid todoDescription', async () => {
      const quest_id = (await QuestRepo.findActiveMainQuest())!._id.toHexString();
      const reqBody = {
        quest_id,
        action: 'finish',
        todoDescription: 'invalid_todo'
      }
      const response = await request(app).post('/leveling/quest/handle-todo').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: To-do not found, this to-do or quest may not exist`);
      expect(response.body.body).toBe(null);
    });
  });

  describe('/leveling/quest/finish', () => {
    test('Should respond with 202 status code and correct message uppon correct properties', async () => {
      const quest_id = (await QuestRepo.findActiveMainQuest())!._id.toHexString();
      await QuestRepo.finishQuestTodo(quest_id, dummyQuest.todos[0]);
      const reqBody = {
        quest_id,
        focusScore: 10
      };
      const response = await request(app).post('/leveling/quest/finish').send(reqBody);

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
      const response = await request(app).post('/leveling/quest/finish').send(reqBody);

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
      const response = await request(app).post('/leveling/quest/finish').send(reqBody);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe(`Bad Request: Invalid quest_id`);
      expect(response.body.body).toBe(null);
    });
  });

  describe('/leveling/quest/distraction', () => {
    test('Should respond with 202 and correct message if active quest', async () => {
      const response = await request(app).get('/leveling/quest/distraction');

      expect(response.status).toBe(202);
      expect(response.body.status).toBe(202);
      expect(response.body.message).toBe(`Distraction score increased`);
      expect(response.body.body).toBe(null);
    });

    test('Should respond with 400 and correct message if no active quest', async () => {
      const quest = (await QuestRepo.findActiveMainQuest())!;
      await QuestRepo.finishQuestTodo(quest._id.toHexString(), quest.todos[0].description);
      await QuestRepo.finishQuest(quest._id.toHexString(), 1);

      const response = await request(app).get('/leveling/quest/distraction');

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