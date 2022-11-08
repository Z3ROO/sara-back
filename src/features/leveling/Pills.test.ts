import PillsRepo from '../../repositories/leveling/PillsRepo';
import Pills from './Pills';
import { initMongoDB, closeDb } from '../../infra/database/mongodb';
import { BadRequest } from '../../util/errors/HttpStatusCode';

describe('Pills domain logic', () => {
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

  test('Should successfully return all existing pills', async () => {
    const pills = await Pills.getAllPills();
    
    expect(pills.length).toBe(3);
    expect(pills[0]).toMatchObject(dummyPill01);
    expect(pills[1]).toMatchObject(dummyPill02);
    expect(pills[2]).toMatchObject(dummyPill03);
  });

  test('Should successfully return all tekeable pills', async () => {
    const pills = await Pills.getTakeablePills();
    
    expect(pills.length).toBe(2);
    expect(pills[0]).toMatchObject(dummyPill01);
    expect(pills[1]).toMatchObject(dummyPill02);
  });

  test('Should successfully return one pill by _id', async () => {
    const pill_id = (await Pills.getAllPills())[0]._id;
    const pill = await Pills.getOnePill(pill_id.toHexString());

    expect(pill!._id).toMatchObject(pill_id);
  });

  test('Should throw Bad Request if invalid pill_id when tyring to get one', async () => {
    const getPill = async () => await Pills.getOnePill('invalid_id');

    await expect(getPill).rejects.toThrow(new BadRequest('Invalid pill_id'))
  });

  test('Should successfully take a pill', async () => {
    const pillToTake = (await Pills.getTakeablePills())[0];
    await Pills.takePill(pillToTake._id.toHexString());
    const pillTaken = await Pills.getOnePill(pillToTake._id.toHexString());

    expect(pillTaken!.times_taken).toBe(pillToTake.times_taken + 1);
    expect(pillTaken!.history[0].increment).toBe(1);
  });

  test('Should throw Bad Request if invalid pill_id when trying to take pill', async () => {
    const takePill = async () => await Pills.takePill('invalid_id');

    await expect(takePill).rejects.toThrow(new BadRequest('Invalid pill_id'))
  });

  test('Should successfully add new Pill', async () => {
    await PillsRepo.wipeCollection();
    const dummyPill = {
      name: 'Pill',
      description: 'pill desc'
    };

    await Pills.addNewPill(dummyPill);
    const createdPill = (await Pills.getAllPills())[0]
    
    expect(createdPill).toMatchObject(dummyPill);
  });

  test('Should throw Bad Request if try to create duplicate Pill', async () => {
    const dummyPill = {
      name: 'Pill 01',
      description: 'pill desc'
    };

    const createPill = async () => await Pills.addNewPill(dummyPill);

    await expect(createPill).rejects.toThrow(new BadRequest('A pill with this name already exists'));
  });

  test('Should successfully delete one Pill', async () => {
    const pill_id = (await Pills.getAllPills())[1]._id.toHexString();
    await Pills.deletePill(pill_id);
    const deletedPill = await Pills.getOnePill(pill_id);

    expect(deletedPill).toBe(null);
  });

  test('Should throw Bad Request if invalid pill_id issued when trying to delete a pill', async () => {
    const deletePill = async () => Pills.deletePill('invalid_id');

    await expect(deletePill).rejects.toThrow(new BadRequest('Invalid pill_id'))
  });

  test('Should throw Bad Request if pill not taken more than 3 times when trying to delete a pill', async () => {
    const pill_id = (await Pills.getAllPills())[0]._id.toHexString();
    const deletePill = async () => Pills.deletePill(pill_id);

    await expect(deletePill).rejects.toThrow(new BadRequest('Pills must be taken at least 3 times to be deleted'))
  });
})