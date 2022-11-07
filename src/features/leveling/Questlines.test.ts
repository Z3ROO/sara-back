import { closeDb, initMongoDB } from "../../infra/database/mongodb";
import QuestlinesRepo from "../../repositories/leveling/QuestlinesRepo";
import { BadRequest } from "../../util/errors/HttpStatusCode";
import { INewQuest, INewQuestline, IQuestline } from "../interfaces/interfaces";
import { Questlines } from './Questlines'
import { Quest } from '../Quest'
import QuestRepo from "../../repositories/QuestRepo";

describe('Questlines domain logic', () => {
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
    await QuestlinesRepo.wipeCollection();
    await QuestRepo.wipeCollection();
    await QuestlinesRepo.insertOneQuestline(dummyQuestline01);
    await QuestlinesRepo.insertOneQuestline(dummyQuestline02);
    await QuestlinesRepo.insertOneQuestline(dummyQuestline03);
  });

  afterAll(async () => {
    await QuestlinesRepo.wipeCollection();
    await QuestRepo.wipeCollection();
    await closeDb();
  });

  test('Should return the active questline', async () => {
    const questline = await Questlines.getActiveQuestline();

    expect(questline).toMatchObject(dummyQuestline03);
  });

  test('Should throw Bad Request if no active questline is found', async () => {
    await QuestlinesRepo.wipeCollection();
    const questline = async () => await Questlines.getActiveQuestline();

    expect(questline).rejects.toThrow(new BadRequest('No active questline found'));
  });

  test('Should return all existing questlines', async () => {
    const questlines = await Questlines.getAllQuestlines();
    
    expect(questlines.length).toBe(3);
  });

  test('Should return all finished questlines', async () => {
    const questlines = await Questlines.getAllFineshedQuestlines();
    
    expect(questlines.length).toBe(2);
  });

  test('Should return one questline by specified _id', async () => {
    const _id = (await Questlines.getActiveQuestline())._id
    const questline = await Questlines.getOneQuestline(_id.toHexString());

    expect(questline!._id).toMatchObject(_id);
  })

  test('Should throw Bad request if invalid _id', async () => {
    const _id = 'invalid_id'
    const questline = async () => await Questlines.getOneQuestline(_id);

    expect(questline).rejects.toThrow(new BadRequest('Invalid questline_id'));
  })

  test('Should get all questlines finished in an specified day', async () => {
    const day = new Date('2022-07-03 10:00:00');
    const questlines = await Questlines.getFineshedQuestlinesOfOneDay(day);

    expect(questlines.length).toBe(2);
  });

  test('Should successfully create new questline', async () => {
    await QuestlinesRepo.wipeCollection();
    const dummyQuestline: INewQuestline = {
      title: 'New questline',
      description: 'description',
      timecap: 23131321
    };

    await Questlines.createNewQuestline(dummyQuestline);

    const createdQuestline = await Questlines.getActiveQuestline();

    expect(createdQuestline).toMatchObject(dummyQuestline);
  });

  test('Should throw Bad Request if missing property when creating new questline', async () => {
    await QuestlinesRepo.wipeCollection();
    const dummyQuestline: any = {
      title: 'New questline',
      description: 'description',
      //timecap: 23131321
    };
    
    const createdQuestline = async () => await Questlines.createNewQuestline(dummyQuestline);

    expect(createdQuestline).rejects.toThrow(new BadRequest('Property "timecap" is missing'));
  });

  test('Should throw Bad Request if active questline already exist when creating new questline', async () => {
    const dummyQuestline: any = {
      title: 'New questline',
      description: 'description',
      timecap: 23131321
    };

    const createQuestline = async () => await Questlines.createNewQuestline(dummyQuestline);

    expect(createQuestline).rejects.toThrow(new BadRequest('An active main questline already exist'));
  });

  test('Should succesfully finish/invalidate questline', async () => {
    const questline_id = (await Questlines.getActiveQuestline())._id.toHexString();
    await Questlines.terminateActiveQuestline('finished');
    const questline = await Questlines.getOneQuestline(questline_id);

    expect(questline!.state).toBe('finished');
  });

  test('Should throw Bad Request if active quest when trying to finish/invalidate questline', async () => {
    const questline_id = (await Questlines.getActiveQuestline())._id.toHexString();
    const quest: INewQuest = {
      questline_id, //must fix making it not required
      title: 'Quest',
      description: 'Description',
      timecap: 123132,
      type: 'main',
      todos: ['To-do']
    };

    await Quest.createNewQuest(quest)
    const questline = async () => await Questlines.terminateActiveQuestline('finished');

    expect(questline).rejects.toThrow(new BadRequest('Can\'t finish, a quest is currently active'));
  });

  test('Should throw Bad Request if no active questline when trying to finish/invalidate questline', async () => {
    await QuestlinesRepo.wipeCollection();
    const questline = async () => await Questlines.terminateActiveQuestline('finished');

    expect(questline).rejects.toThrow(new BadRequest('No active Main Questline to be finished'));
  });
  
  test('Should successfully delete one specified questline', async () => {
    const questline_id = (await Questlines.getActiveQuestline())._id.toHexString();
    await Questlines.deleteOneQuestline(questline_id);

    const questline = await Questlines.getOneQuestline(questline_id);

    expect(questline).toBe(null);
  });

  test('Should throw Bad Request if invalid _id when trying to delete one specified questline', async () => {
    const questline_id = 'invalid_id';

    const questline = async () => await Questlines.deleteOneQuestline(questline_id);

    expect(questline).rejects.toThrow(new BadRequest('Invalid questline_id'));
  });
});