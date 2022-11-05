import { IFeats } from "../features/interfaces/interfaces";
import { FeatsRepo } from "./FeatsRepo";

describe('Feats Repository', () => {
  test('Should successfully retrieve all feats', async () => {
    const dummyFeatBodyParts = {
      questline_id: 'questline_fk-id',
      description: 'Feat description',
      xp: 25
    }

    const { records } = await FeatsRepo.findAllFeats();

    expect(records.length).toBeGreaterThanOrEqual(6)
    records.forEach(record => expect(record).toMatchObject(dummyFeatBodyParts));
  });

  test('Should successfully retrieve one feat by id', async () => {
    const dummyFeat = {
      id: 'featId-01',
      questline_id: 'questline_fk-id',
      title: 'Dummy Feat 1',
      description: 'Feat description',
      categories: null,
      type: 'feat',
      tier: 1,
      level: 0,
      completed: false,
      xp: 25,
      finished_at: null
    }
    const { record} = await FeatsRepo.findOneFeat(dummyFeat.id);

    expect(record).toEqual(dummyFeat);
  });

  test('Should successfully retrieve one feat by title', async () => {
    const dummyFeat = {
      id: 'featId-01',
      questline_id: 'questline_fk-id',
      title: 'Dummy Feat 1',
      description: 'Feat description',
      categories: null,
      type: 'feat',
      tier: 1,
      level: 0,
      completed: false,
      xp: 25,
      finished_at: null
    }
    const { record} = await FeatsRepo.findOneFeatByTitle(dummyFeat.title);

    expect(record).toEqual(dummyFeat);
  });

  test('Should successfully find every complete feat in a date range', async () => {
    const dummyFeatBodyParts = {
      description: 'Feat description',
      questline_id: 'questline_fk-id',
      completed: true,
      xp: 25
    };
    const beginning = '2022-07-02 15:50:28 GMT-3';
    const ending = '2022-07-04 15:50:28 GMT-3';
    const { records } = await FeatsRepo.findAllCompleteFeatsInDateRange(beginning, ending);

    expect(records.length).toBeGreaterThanOrEqual(2);
    records.forEach(record => expect(record).toMatchObject(dummyFeatBodyParts))
  });
  
  test('Should successfully create one feat', async () => {
    const dummyFeat: IFeats = {
      questline_id: 'questline_fk-id',
      title: 'Dummy Feat create test',
      description: 'Feat description',
      categories: 'category',
      tier: 1,
      xp: 25
    }

    await FeatsRepo.insertOneFeat(dummyFeat);
    const { record } = await FeatsRepo.findOneFeatByTitle(dummyFeat.title);

    expect(record).toMatchObject(dummyFeat);
  });
  
  test('Should successfully update one feat', async () => {
    const dummyIdentifier = 'featId-03';
    const dummyFeatBodyParts = {
      level: 9
    };

    await FeatsRepo.updateOneFeat(dummyIdentifier, dummyFeatBodyParts);
    const { record } = await FeatsRepo.findOneFeat(dummyIdentifier);

    expect(record.level).toBe(dummyFeatBodyParts.level);
  });

  test('Should successfully update many feat properties', async () => {
    const dummyIdentifier = 'featId-08';
    const dummyFeatBodyParts = {
      title: 'Dummy Feat 8',
      level: 9
    };

    await FeatsRepo.updateOneFeat(dummyIdentifier, dummyFeatBodyParts);
    const { record } = await FeatsRepo.findOneFeat(dummyIdentifier);

    expect(record).toMatchObject(dummyFeatBodyParts);
  });

  test('Should successfully delete one feat', async () => {
    const dummyIdentifier = 'featId-07';

    await FeatsRepo.deleteOneFeat(dummyIdentifier);
    const { records } = await FeatsRepo.findOneFeat(dummyIdentifier);

    expect(records.length).toBe(0);
  });
})