import { closeDb, initMongoDB } from "../../infra/database/mongodb";
import QuestsRepo from "../../repositories/leveling/QuestsRepo";
import QuestlinesRepo from "../../repositories/leveling/QuestlinesRepo";
import { Questlines } from "./Questlines";
import { Quests } from "./Quests";
import { INewQuest, IQuest } from "../interfaces/interfaces";
import { BadRequest } from "../../util/errors/HttpStatusCode";

describe('Quests Domain Logic', () => {
  const dummyQuest01: IQuest = {
    questline_id: null,
    skill_id: null,
    mission_id: null,
    title: 'Quest 01',
    description: 'Quest description',
    type: 'main',
    state: 'finished',
    todos: [{
      description: 'To-do',
      state: 'finished',
      finished_at: new Date()
    }],
    timecap: 132132132,
    pause: [],
    focus_score: 6,
    distraction_score: [new Date(), new Date()],
    created_at: new Date(),
    finished_at: new Date('2022-07-03 10:00:28 GMT-3'),
    xp: null
  }

  const dummyQuest02: IQuest = {
    ...dummyQuest01,
    title: 'Quest 02'
  }

  const dummyQuest03: IQuest = {
    ...dummyQuest01,
    title: 'Quest 03',
    state: 'active',
    todos: [{
      description: 'To-do',
      state: 'active',
      finished_at: new Date()
    }],
    finished_at: null
  }

  const dummyQuest04: IQuest = {
    ...dummyQuest01,
    title: 'Quest 04',
    type: 'practice',
    finished_at: new Date()
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await QuestsRepo.wipeCollection();
    await QuestlinesRepo.wipeCollection();
    await Questlines.createNewQuestline({
      title: 'Questline',
      description: 'Description',
      timecap: 100000000
    });
    await QuestsRepo.insertOneQuest(dummyQuest01);
    await QuestsRepo.insertOneQuest(dummyQuest02);
    await QuestsRepo.insertOneQuest(dummyQuest03);
    await QuestsRepo.insertOneQuest(dummyQuest04);
  });

  afterAll(async () => {
    await QuestlinesRepo.wipeCollection();
    await QuestsRepo.wipeCollection();
    await closeDb();
  });

  test('Should return active quest if any', async () => {
    const quest = await Quests.getActiveQuest();

    expect(quest).toMatchObject(dummyQuest03);
  });

  test('Should throw Bad Request if no active quest is found', async () => {
    QuestsRepo.wipeCollection();
    const findQuest = async () => Quests.getActiveQuest();

    expect(findQuest).rejects.toThrow(new BadRequest("No active quest found"));
  });

  test('Should return one quest by the specified _id', async () => {
    const quest_id = (await Quests.getActiveQuest())!._id;
    const quest = await Quests.getOneQuest(quest_id.toHexString());

    expect(quest!._id).toMatchObject(quest_id);
  });

  test('Should return an array containing every fineshed quest', async () => {
    const quests = await Quests.getAllFinishedQuests();

    expect(quests.length).toBe(3);
    quests.forEach(quest => expect(quest.state).toBe('finished'));
  });

  test('Should return an array containing every fineshed quest of a specified day', async () => {
    const day = new Date('2022-07-03 10:00:28 GMT-3');
    const quests = await Quests.getEveryFinishedQuestOfOneDay(day);

    expect(quests.length).toBe(2);
  });

  test('Should successfully finish or invalidate quest to-do', async () => {
    const quest = (await Quests.getActiveQuest())!;
    const quest_id = quest._id.toHexString();
    const todoDescription = quest.todos[0].description;
    await Quests.handleQuestTodo(quest_id, todoDescription, 'finish');

    const updatedQuest = (await Quests.getActiveQuest())!;

    expect(updatedQuest.todos[0].state).toBe('finished');
  });

  test('Should throw Bad Request if invalid quest_id is issued', async () => {
    const handleTodo = async () => await Quests.handleQuestTodo('invalid_id', 'asdsa', 'finish');

    expect(handleTodo).rejects.toThrow(new BadRequest('Invalid quest_id'));
  });

  test('Should throw Bad Request if to-do/quest was not found', async () => {
    const quest = (await Quests.getActiveQuest())!;
    const quest_id = quest._id.toHexString();
    const handleTodo = async () => await Quests.handleQuestTodo(quest_id, 'Invalid_todoDescription', 'finish');

    await expect(handleTodo).rejects.toThrow(new BadRequest('To-do not found, this to-do or quest may not exist'));
  });

  test('Should throw Bad Request if to-do was already handled', async () => {
    const quest = (await Quests.getActiveQuest())!;
    const quest_id = quest._id.toHexString();
    const todoDescription = quest.todos[0].description;
    await Quests.handleQuestTodo(quest_id, todoDescription, 'finish');
    const handleTodo = async () => Quests.handleQuestTodo(quest_id, todoDescription, 'finish');

    expect(handleTodo).rejects.toThrow(new BadRequest('To-do already handled'));
  });

  test('Should successfully create new quest', async () => {
    await QuestsRepo.wipeCollection();
    const dummyQuest: any = {
      title: 'New Quest',
      description: 'Description',
      type: 'main',
      todos: ['to-do'],
      timecap: 10*60*1000
    }

    await Quests.createNewQuest(dummyQuest, {questline:true});
    const newQuest = await Quests.getActiveQuest();
    delete dummyQuest.todos;

    expect(newQuest).toMatchObject(dummyQuest);
  });

  test('Should throw Bad Request if try to create quest with less than minimun timecap', async () => {
    await QuestsRepo.wipeCollection();
    const dummyQuest: any = {
      title: 'New Quest',
      description: 'Description',
      type: 'main',
      todos: ['to-do'],
      timecap: (10*60*1000) - 1
    }

    const createQuest = async () => await Quests.createNewQuest(dummyQuest, {questline:true});

    await expect(createQuest).rejects.toThrow(new BadRequest('timecap must be above 10 minutes'));
  });

  test('Should throw Bad Request if no active questline when trying to create one', async () => {
    await QuestlinesRepo.wipeCollection();
    await QuestsRepo.wipeCollection();
    const dummyQuest: INewQuest = {
      title: 'New Quest',
      description: 'Description',
      type: 'main',
      todos: ['to-do'],
      timecap: 10*60*1000
    };

    const createQuest = async () => await Quests.createNewQuest(dummyQuest, {questline:true});

    await expect(createQuest).rejects.toThrow(new BadRequest('No active questline found'));
  })

  test('Should throw Bad Request if try to create quest with no group', async () => {
    await QuestsRepo.wipeCollection();
    const dummyQuest: INewQuest = {
      title: 'New Quest',
      description: 'Description',
      type: 'main',
      todos: ['to-do'],
      timecap: 10*60*1000
    };

    const createQuest = async () => await Quests.createNewQuest(dummyQuest,{});

    await expect(createQuest).rejects.toThrow(new BadRequest('Quest groups are at least one and no more than that.'));
  });

  test('Should throw Bad Request if try to create quest with too many groups', async () => {
    await QuestsRepo.wipeCollection();
    const dummyQuest: INewQuest = {
      title: 'New Quest',
      description: 'Description',
      type: 'main',
      todos: ['to-do'],
      timecap: 10*60*1000
    };

    const createQuest = async () => await Quests.createNewQuest(dummyQuest,{questline:true, skill: '123456789123456789123456'});

    await expect(createQuest).rejects.toThrow(new BadRequest('Quest groups are at least one and no more than that.'));
  });

  test('Should throw Bad Request if an active quest already exists', async () => {
    const dummyQuest: INewQuest = {
      title: 'New Quest',
      description: 'Description',
      type: 'main',
      todos: ['to-do'],
      timecap: 10*60*1000
    }

    const createQuest = async () => await Quests.createNewQuest(dummyQuest, {questline:true});

    await expect(createQuest).rejects.toThrow(new BadRequest('An active quest already exist'));
  });

  test('Should throw Bad Request if Invalid skill_id is issued', async () => {
    await QuestsRepo.wipeCollection();
    const dummyQuest: INewQuest = {
      title: 'New Quest',
      description: 'Description',
      type: 'main',
      todos: ['to-do'],
      timecap: 10*60*1000
    }

    const createQuest = async () => await Quests.createNewQuest(dummyQuest, {skill: 'invalid_id'});

    await expect(createQuest).rejects.toThrow(new BadRequest('Invalid skill_id'));
  });

  test('Should successfully increase distraction points', async () => {
    await Quests.insertDistractionPoint();
    const quest = await Quests.getActiveQuest();

    expect(quest.distraction_score.length).toBe(3);
  });

  test('Should successfully finish quest', async () => {
    const quest_id = (await Quests.getActiveQuest())._id.toHexString();
    await Quests.terminateQuest(quest_id, 10, 'finished');
    const quest = await Quests.getOneQuest(quest_id);

    expect(quest!.state).toBe('finished');
  });

  test('Should return to-do status if any to-do found', async () => {
    const quest = await Quests.getActiveQuest();
    const quest_id = quest._id.toHexString();
    const todoDescription = quest.todos[0].description;
    const todoStatus = await Quests.getQuestTodoStatus(quest_id, todoDescription);

    expect(todoStatus).toBe('active');
  })
});