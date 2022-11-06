import { IQuestline } from "../features/interfaces/interfaces";
import { closeDb, db, initMongoDB } from "../infra/database/mongodb";
import QuestlineRepo from "./QuestlineRepo";

describe('Questline Repository', () => {
  const dummyQuestline01: IQuestline = {
    title: 'Questline 01',
    description: 'Questline description',
    state: 'finished',
    timecap: 10000000,
    created_at: new Date(),
    finished_at: new Date('2022-07-03 10:00:00'),
    xp: null
  }

  const dummyQuestline02: IQuestline = {
    ...dummyQuestline01,
    title: 'Questline 02'
  }

  const dummyQuestline03: IQuestline = {
    ...dummyQuestline01,
    title: 'Questline 03',
    state: 'active',
    finished_at: null
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await db('leveling').collection('questlines').deleteMany({});
    await QuestlineRepo.insertOneQuestline(dummyQuestline01);
    await QuestlineRepo.insertOneQuestline(dummyQuestline02);
    await QuestlineRepo.insertOneQuestline(dummyQuestline03);
  });

  afterAll(async () => {
    await db('leveling').collection('questlines').deleteMany({});
    await closeDb();
  });

  test('Should successfully retrieve main questline', async () => {
    const questline = await QuestlineRepo.findActiveQuestline();

    expect(dummyQuestline03).toMatchObject(questline!);
  });

  test('Should successfully retrieve all finished questlines', async () => {
    const questlines = await QuestlineRepo.findAllFinishedQuestlines();

    expect(questlines[0]).toMatchObject(dummyQuestline01);
    expect(questlines[1]).toMatchObject(dummyQuestline02);
  })

  test('Should successfully retrieve the specified questline by id', async () => {
    const questline_id = (await QuestlineRepo.findAllQuestlines())[0]._id;
    const questline = await QuestlineRepo.findOneQuestline(questline_id.toHexString());

    expect(questline!._id).toMatchObject(questline_id);
  });

  test('Should successfully retrieve finished questlines in date range', async () => {
    const begin = new Date('2022-07-03 00:00:00');
    const end = new Date('2022-07-03 23:59:00');
    const questlines = await QuestlineRepo.findFineshedQuestlinesInDateRange({begin, end});
    
    expect(questlines.length).toBe(2);
    expect(questlines[0].state).toBe('finished');
    expect(questlines[1].state).toBe('finished');
  })

  test('Should succesfully create a questline', async () => {
    await db('leveling').collection('questlines').deleteMany({});

    const dummyQuestline: IQuestline = {
      ...dummyQuestline03,
      title: 'New Questline'
    }

    await QuestlineRepo.insertOneQuestline(dummyQuestline);
    
    const questline = await QuestlineRepo.findActiveQuestline();

    expect(dummyQuestline).toMatchObject(questline!);
  });

  test('Should succesfully finish questline', async () => {
    const questline_id = (await QuestlineRepo.findActiveQuestline())!._id
    await QuestlineRepo.terminateActiveQuestline('finished');

    const questline = await QuestlineRepo.findOneQuestline(questline_id.toHexString());
    
    expect(questline!.state).toBe('finished');
  });

  test('Should succesfully invalidate questline', async () => {
    const questline_id = (await QuestlineRepo.findActiveQuestline())!._id
    await QuestlineRepo.terminateActiveQuestline('invalidated');

    const questline = await QuestlineRepo.findOneQuestline(questline_id.toHexString());
    
    expect(questline!.state).toBe('invalidated');
  });

  test('Should successfully delete questline', async () => {
    const questline_id = (await QuestlineRepo.findActiveQuestline())!._id;

    await QuestlineRepo.deleteQuestline(questline_id.toHexString());

    const questline = await QuestlineRepo.findOneQuestline(questline_id.toHexString());

    expect(questline).toBe(null);
  });
});