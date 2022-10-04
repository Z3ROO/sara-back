import { stat } from 'fs';
import { IAchievement, IUpdateAchievement } from '../../features/interfaces/interfaces';
//import '../../dotenv.config.ts';
import { RepositoryError } from '../../util/errors/RepositoryError';
import AchievementsRepo from './AchievementsRepo';

describe('Achievements Repository', () => {
  test('Should successfully retrieve all achievements from database', async () => {
    const dummyAchievementBodyPart = {
      description: 'Achiev description',
      requirements: '["requirements"]',
      xp: 25
    }

    const { records } = await AchievementsRepo.findAllAchievements();

    records.forEach(record => expect(record).toMatchObject(dummyAchievementBodyPart));
    expect(records.length).toBeGreaterThanOrEqual(6);
  })

  test('Should successfully retrieve one achievement from database with specified id', async () => {
    const dummyAchievement = {
      id: 'achievId-01',
      title: 'Dummy Achiev 1',
      description: 'Achiev description',
      requirements: '["requirements"]',
      type: 'achievement',
      boost: 3,
      xp: 25
    };

    const { record } = await AchievementsRepo.findOneAchievement(dummyAchievement.id);

    expect(record).toMatchObject(dummyAchievement);
  })

  test('Should successfully retrieve one achievement from database with specified title', async () => {
    const dummyAchievement = {
      id: 'achievId-01',
      title: 'Dummy Achiev 1',
      description: 'Achiev description',
      requirements: '["requirements"]',
      type: 'achievement',
      boost: 3,
      xp: 25
    };

    const { record } = await AchievementsRepo.findOneAchievementByTitle(dummyAchievement.title);

    expect(record).toMatchObject(dummyAchievement);
  })

  test('Should successfully retrieve all achievements in date range', async () => {
    const dummyDate = '2022-07-03 15:50:28 GMT-3'
    const dummyAchievement = {
      id: 'achievId-09', 
      questline_id: 'questline_fk-id', 
      title: 'Dummy Achiev finished', 
      description: 'Achiev description',
      requirements: '["requirements"]',
      type: 'achievement',
      completed: true,
      boost: 3,
      xp: 25
    }

    const { record } = await AchievementsRepo.findAllAchievementsInDateRange(dummyDate, dummyDate);

    expect(record).toMatchObject(dummyAchievement);
  })

  test('Should successfully retrieve all completed titles', async () => {
    const dummyAchievementBodyPart = {
      questline_id: 'uuid2',
      description: 'Achiev description',
      requirements: '["requirements"]',
      type: 'title'
    };

    const { records } = await AchievementsRepo.findAllCompletedTitles();

    records.forEach( record => expect(record).toMatchObject(dummyAchievementBodyPart))
  })

  test('Should successfully retrieve all completed titles before date', async () => {
    const dummyAchievementDate = '2022-07-03 17:50:28 GMT-3'
    const dummyAchievementBodyPart = {
      questline_id: 'uuid2',
      description: 'Achiev description',
      requirements: '["requirements"]',
      type: 'title'
    };
    const { records } = await AchievementsRepo.findAllCompletedTitlesBeforeDate(dummyAchievementDate);
    
    expect(records.length).toBeGreaterThanOrEqual(2);
    records.forEach(record => expect(record).toMatchObject(dummyAchievementBodyPart));
  })
  
  test('Should successfully insert achievements in database', async () => {
    const dummyAchievement: IAchievement = {
      questline_id: 'questline_fk-id',
      title: 'Dummy Achiev 4',
      description: 'Achiev description',
      requirements: '["requirements"]',
      type: 'achievement',
      boost: 3,
      xp: 25
    };

    await AchievementsRepo.insertOneAchievement(dummyAchievement);

    const { record } = await AchievementsRepo.findOneAchievementByTitle(dummyAchievement.title);
    expect(record).toMatchObject(dummyAchievement);
  })

  test('Should throw Repository Error if trying to add already existing achievement title', async () => {
    const dummyAchievement: IAchievement = { // a set of dummies was set in the testing migrations
      questline_id: 'questline_fk-id',
      title: 'Dummy Achiev 1',
      description: 'Achiev Description',
      requirements: '["string"]',
      type: 'achievement',
      boost: 1,
      xp: 25
    }

    const sut = async () => await AchievementsRepo.insertOneAchievement(dummyAchievement);

    expect(sut()).rejects.toThrow(new RepositoryError('An achievement with this title already exists.'));
  })

  test('Should successfully update one achievement property', async () => {
    const dummyIdentifier = 'Dummy Achiev to update 1';
    const dummyNewDescription = 'Updated Description';

    await AchievementsRepo.updateAchievementProperties(dummyIdentifier, { description: dummyNewDescription });
    
    const { record } = await AchievementsRepo.findOneAchievementByTitle(dummyIdentifier);
    
    expect(record.description).toBe(dummyNewDescription);
  })

  test('Should successfully update many achievement properties', async () => {
    const dummyIdentifier = 'Dummy Achiev to update 2';
    const dummyPropertiesToUpdate: IUpdateAchievement = { 
      description: 'Updated Description',
      boost: 5,
      type: 'title'
    };

    await AchievementsRepo.updateAchievementProperties(dummyIdentifier, dummyPropertiesToUpdate);
    const { record } = await AchievementsRepo.findOneAchievementByTitle(dummyIdentifier);

    expect(record).toMatchObject(dummyPropertiesToUpdate);
  })

  test('Should throw Repository Error if try to update title to an already existing one.', async () => {
    const dummyIdentifier = 'Dummy Achiev to update 3';
    const dummyPropertiesToUpdate = {
      title: 'Dummy Achiev 1'
    };

    const sut = async () => await AchievementsRepo.updateAchievementProperties(dummyIdentifier, dummyPropertiesToUpdate);
    
    expect(sut()).rejects.toThrow(new RepositoryError('An achievement with this title already exists.'));
  })

  test('Should successfully delete one row', async () => {
    const dummyIdentifier = 'Dummy Achiev to delete';
    await AchievementsRepo.deleteOneAchievement(dummyIdentifier);
    const { records } = await AchievementsRepo.findOneAchievementByTitle(dummyIdentifier);

    expect(records.length).toBe(0);
  })
})