import { INewRecord, IRecords } from "../features/interfaces/interfaces";
import { Records } from "../features/Records";
import { closeDb, db, initMongoDB } from "../infra/database/mongodb"
import RecordsRepo from "./RecordsRepo";

describe('Records Repository', () => {
  const dummyRecord01: INewRecord = {
    questline_id: '123456789123456789123456',
    title: 'Record 01',
    description: 'Record description',
    metric: 'unit',
    status: {
      waitTime: 10,
      stageAmount: 2
    },
    categories: ['some-category']
  }

  const dummyRecord02: INewRecord = {
    ...dummyRecord01,
    title: 'Record 02'
  }
  
  beforeAll(async () => {
    await initMongoDB();
  })

  beforeEach(async () => {
    await db('leveling').collection('records').deleteMany({});
    await Records.createNewRecord(dummyRecord01);
    await Records.createNewRecord(dummyRecord02);
  })

  afterAll(async () => {
    await db('leveling').collection('records').deleteMany({});
    await closeDb();
  })

   //==============================================================
  // BEGIN TESTS =================================================
  //==============================================================

  test('Should successfully retrieve all Records', async () => {
    const records = await RecordsRepo.findAllRecords();
    
    expect(records[0]).toMatchObject(dummyRecord01);
    expect(records[1]).toMatchObject(dummyRecord02);
  });

  test('Should successfully retrieve one Record by _id', async () => {
    const record_id = (await RecordsRepo.findAllRecords())[0]._id;
    const record = await RecordsRepo.findOneRecord(record_id.toHexString());

    expect(record_id).toMatchObject(record!._id)
  });
  
  test('Should successfully create one Record', async () => {
    await db('leveling').collection('records').deleteMany({});

    const dummyRecord: IRecords = {
      questline_id: null,
      skill_id: null,
      title: 'Record',
      description: 'Description',
      acceptance: {
        stage: 'created',
        date: [new Date()]
      },
      metric: 'unit',
      status: {
        waitTime: 100000,
        stageAmount: 5,
        stage: null,
        last_commitment: null
      },
      categories: [],
      level: 0,
      history: [],
      xp: null
    };

    await RecordsRepo.insertOneRecord(dummyRecord);
    const record = (await RecordsRepo.findAllRecords())[0];
    
    expect(dummyRecord).toMatchObject(record);
  });
  
  test('Should successfully update one Record', async () => {
    const record_id = (await RecordsRepo.findAllRecords())[0]._id.toHexString();
    const recordEdit = {
      title: 'Record 03',
      description: 'Description edited'
    };
    await RecordsRepo.updateOneRecord(record_id, recordEdit);
    const record = await RecordsRepo.findOneRecord(record_id);

    expect(record!).toMatchObject(recordEdit);
  });

  test('Should successfully delete one Record', async () => {
    const record_id = (await RecordsRepo.findAllRecords())[0]._id.toHexString();
    await RecordsRepo.deleteOneRecord(record_id);
    const record = await RecordsRepo.findOneRecord(record_id);

    expect(record).toBe(null);
  });
});