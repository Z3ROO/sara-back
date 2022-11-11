import { closeDb, initMongoDB } from '../../infra/database/mongodb';
import PillsRepo from './PillsRepo';

describe('Pills repository', () => {
  const dummyPill01 = {
    name: 'Pill 01',
    description: 'Description',
    times_taken: 0,
    next_shot: new Date(),
    history: []
  };

  const dummyPill02 = {
    ...dummyPill01,
    name: 'Pill 02',
    times_taken: 7
  };

  const dummyPill03 = {
    ...dummyPill01,
    name: 'Pill 03',
    times_taken: 15,
    next_shot: new Date(Date.now()+(24*60*60*1000))
  };

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await PillsRepo.wipeCollection();
    await PillsRepo.insertOnePill(dummyPill01);
    await PillsRepo.insertOnePill(dummyPill02);
    await PillsRepo.insertOnePill(dummyPill03);
  });
  
  afterAll(async () => {
    await PillsRepo.wipeCollection();
    await closeDb();
  });


  test('Should successfully retrieve all existing pills', async () => {
    const pills = await PillsRepo.findAllPills();
    
    expect(pills.length).toBe(3);
    expect(pills[0]).toMatchObject(dummyPill01);
    expect(pills[1]).toMatchObject(dummyPill02);
    expect(pills[2]).toMatchObject(dummyPill03);
  });

  test('Should successfully retrieve all tekeable pills', async () => {
    const pills = await PillsRepo.findAllTakeablePills();
    
    expect(pills.length).toBe(2);
    expect(pills[0]).toMatchObject(dummyPill01);
    expect(pills[1]).toMatchObject(dummyPill02);
  });

  test('Should successfully retrieve one pill by _id', async () => {
    const pill_id = (await PillsRepo.findAllPills())[0]._id;
    const pill = await PillsRepo.findOnePill(pill_id.toHexString());

    expect(pill!._id).toMatchObject(pill_id);
  });

  test('Should successfully update any pill for next shot', async () => {
    const pill_id = (await PillsRepo.findAllPills())[0]._id;
    const next_shot = new Date(Date.now() + (24*60*60*1000));
    await PillsRepo.updatePill(pill_id.toHexString(), next_shot, 1);
    const updatedPill = await PillsRepo.findOnePill(pill_id.toHexString());
    
    expect(updatedPill!.times_taken).toBe(1);
  });

  test('Should successfully insert one Pill', async () => {
    const dummyPill = {
      name: 'Pill',
      description: 'Description',
      times_taken: 0,
      next_shot: new Date(),
      history: []
    };
    await PillsRepo.insertOnePill(dummyPill);
    const pills = await PillsRepo.findAllPills();
    const createdPill = pills[pills.length-1];
    
    expect(createdPill).toMatchObject(dummyPill);
  });

  test('Should successfully delete one pill', async () => {
    const pill_id = (await PillsRepo.findAllPills())[0]._id.toHexString();
    await PillsRepo.deleteOnePill(pill_id);
    const deletedPill = await PillsRepo.findOnePill(pill_id);

    expect(deletedPill).toBe(null);
  });
})
