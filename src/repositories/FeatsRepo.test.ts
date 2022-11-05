import { Feats } from "../features/Feats";
import { IFeats } from "../features/interfaces/interfaces";
import { closeDb, db, initMongoDB } from "../infra/database/mongodb";
import FeatsRepo from "./FeatsRepo";

describe('Feats Repository', () => {
  const dummyFeat01 = {
    questline_id: '123456789123456789123456',
    title: 'Feat title 01',
    description: 'Feat description 01',
    todos: ['to-do 1'],
    categories: ['some-category'],
    tier: 3
  }

  const dummyFeat02 = {
    ...dummyFeat01,
    title: 'Feat title 02',
    description: 'Feat description 02'
  }

  const dummyFeat03 = {
    ...dummyFeat01,
    title: 'Feat title 03',
    description: 'Feat description 03'
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await Feats.createNewFeat(dummyFeat01);
    await Feats.createNewFeat(dummyFeat02);
  });

  afterAll(async () => {
    await db('leveling').collection('feats').deleteMany({});
    await closeDb();
  });

  //==============================================================
  // BEGIN TESTS =================================================
  //==============================================================

  test('Should successfully retrieve all feats', async () => {
    const feats = await FeatsRepo.findAllFeats();

    const feat01:any = {...dummyFeat01};
    delete feat01.todos;
    const feat02:any = {...dummyFeat02};
    delete feat02.todos;

    expect(feats.length).toBe(2);
    expect(feats[0]).toMatchObject(feat01);
    expect(feats[1]).toMatchObject(feat02);
  });

  test('Should successfully retrieve one feat by _id', async () => {
    const dummyFeat = (await FeatsRepo.findAllFeats())[0];
    const feat = await FeatsRepo.findOneFeat(dummyFeat._id.toHexString());

    expect(feat).toEqual(dummyFeat);
  });

  test('Should successfully find every complete feat in a date range', async () => {
    await Feats.createNewFeat(dummyFeat03);
    const feats = await FeatsRepo.findAllFeats();
    await FeatsRepo.updateOneFeat(feats[0]._id.toHexString(), { completed: true, finished_at: new Date()});
    await FeatsRepo.updateOneFeat(feats[1]._id.toHexString(), { completed: true, finished_at: new Date('2022-07-03 15:50:28 GMT-3')});
    await FeatsRepo.updateOneFeat(feats[2]._id.toHexString(), { completed: true, finished_at: new Date('2022-07-03 15:50:28 GMT-3')});

    const begin = new Date('2022-07-02 15:50:28 GMT-3');
    const end = new Date('2022-07-04 15:50:28 GMT-3');
    const featsInRange = await FeatsRepo.findAllCompleteFeatsInDateRange({begin, end});

    expect(feats.length).toBeGreaterThanOrEqual(2);
    featsInRange.forEach((feat, i) => expect(feat._id).toMatchObject(feats[i+1]._id));
  });
  
  test('Should successfully create one feat', async () => {
    db('leveling').collection('feats').deleteMany({});

    const dummyFeat: IFeats = {
      questline_id: null,
      skill_id: null,
      title: 'Feat title',
      description: 'Feat description',
      acceptance: {
        stage: 'created',
        date: [new Date()]
      },
      todos: null,
      categories: ['category'],
      tier: 3,
      completed: false,
      xp: null,
      finished_at: null
    }

    await FeatsRepo.insertOneFeat(dummyFeat);
    const feat = (await FeatsRepo.findAllFeats())[0];

    expect(feat).toMatchObject(dummyFeat);
  });
  
  test('Should successfully update one feat', async () => {
    const feat_id = (await FeatsRepo.findAllFeats())[0]._id.toHexString();
    const featEdit = {
      completed: true,
      finished_at: new Date()
    };

    await FeatsRepo.updateOneFeat(feat_id, featEdit);
    const feat = await FeatsRepo.findOneFeat(feat_id);

    expect(feat!).toMatchObject(featEdit);
  });

  test('Should successfully delete one feat', async () => {
    const feat_id = (await FeatsRepo.findAllFeats())[0]._id.toHexString();

    await FeatsRepo.deleteOneFeat(feat_id);
    const feat = await FeatsRepo.findOneFeat(feat_id);

    expect(feat).toBe(null);
  });
})