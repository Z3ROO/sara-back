import { IQuest } from "../../features/interfaces/interfaces";
import { closeDb, db, initMongoDB } from "../../infra/database/mongodb";
import QuestRepo from "./QuestsRepo";

describe('Quests Repository', () => {
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
    await QuestRepo.wipeCollection();
    await QuestRepo.insertOneQuest(dummyQuest01);
    await QuestRepo.insertOneQuest(dummyQuest02);
    await QuestRepo.insertOneQuest(dummyQuest03);
    await QuestRepo.insertOneQuest(dummyQuest04);
  });

  afterAll(async () => {
    await QuestRepo.wipeCollection();
    await closeDb();
  });

  test('Should successfully retrieve active quest', async () => {
    const quest = await QuestRepo.findActiveQuest();
    expect(quest!).toMatchObject(dummyQuest03);
  });

  test('Should successfully retrieve one specified quest by _id', async () => {
    const quest_id = (await QuestRepo.findActiveQuest())!._id;
    const quest = await QuestRepo.findOneQuest(quest_id.toHexString());

    expect(quest!._id).toMatchObject(quest_id);
  });

  test('Should successfully retrieve every finished quest', async () => {
    const quests = await QuestRepo.findAllFinishedQuests();

    expect(quests.length).toBe(3);
    expect(quests[0].state).toBe('finished');
    expect(quests[1].state).toBe('finished');    
    expect(quests[2].state).toBe('finished');
  });

  test('Should successfully retrieve every finished quest in date range', async () => {
    const begin = new Date('2022-07-03 00:00:28 GMT-3');
    const end = new Date('2022-07-03 23:59:28 GMT-3');
    const quests = await QuestRepo.findAllFinishedQuestsInDateRange({begin, end});
    
    expect(quests.length).toBe(2);
    expect(quests[0].state).toBe('finished');
    expect(quests[1].state).toBe('finished');
  });

  test('Should successfully create a new quest', async () => {
    await QuestRepo.wipeCollection();
    
    const dummyQuest: IQuest = {
      ...dummyQuest03,
      title: 'New Quest'
    }

    await QuestRepo.insertOneQuest(dummyQuest);
    const quest = await QuestRepo.findActiveQuest();

    expect(quest!.title).toBe('New Quest');
  });

  test('Should successfully finish quest', async () => {
    const activeQuest_id = (await QuestRepo.findActiveQuest())!._id.toHexString();
    await QuestRepo.terminateQuest(activeQuest_id, 10, 'finished');
    
    const finishedQuest = await QuestRepo.findOneQuest(activeQuest_id);
    
    expect(finishedQuest!.state).toBe('finished');
  });
})