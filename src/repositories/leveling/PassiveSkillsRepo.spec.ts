import { IPassiveSkill } from "../../features/interfaces/interfaces";
import { PassiveSkillsRepo } from "./PassiveSkillsRepo";

describe('PassiveSkills Repository', () => {
  test('Should successfully retrieve all passive skills', async () => {
    const dummyPassiveSkillBodyParts = {
      description: 'PassiveSkill description'
    }
    const { records } = await PassiveSkillsRepo.findAllPassiveSkills();

    expect(records.length).toBeGreaterThanOrEqual(6);
    records.forEach(record => expect(record).toMatchObject(dummyPassiveSkillBodyParts));
  });

  test('Should successfully retrieve one passive skill by id', async () => {
    const dummyPassiveSkill = {
      id: 'passiveId-01',
      title: 'Dummy PassiveSkill 1',
      description: 'PassiveSkill description',
      type: 'passive',
      boost: 3,
      stage: 0,
      state: 'sleep'
    };
    const { record } = await PassiveSkillsRepo.findOnePassiveSkill(dummyPassiveSkill.id);

    expect(record).toEqual(dummyPassiveSkill);
  });

  test('Should successfully retrieve one passive skill by title', async () => {
    const dummyPassiveSkill = {
      id: 'passiveId-01',
      title: 'Dummy PassiveSkill 1',
      description: 'PassiveSkill description',
      type: 'passive',
      boost: 3,
      stage: 0,
      state: 'sleep'
    };
    const { record } = await PassiveSkillsRepo.findOnePassiveSkillByTitle(dummyPassiveSkill.title);

    expect(record).toEqual(dummyPassiveSkill);
  });

  test('Should successfully find every passive skill history before date', async () => {
    const dummyDate = '2022-07-03 16:00:00 GMT-3';
    const dummyPassiveSkillJoinedWithHistoryBodyParts = {
      passive_skill_id: 'passiveId-01',
      title: 'Dummy PassiveSkill 1',
      description: 'PassiveSkill description',
      boost: 3
    }
    const { records } = await PassiveSkillsRepo.findPassiveSkillsHistoryBeforeDate(dummyDate);

    expect(records.length).toBeGreaterThanOrEqual(3);
    records.forEach(record => expect(record).toMatchObject(dummyPassiveSkillJoinedWithHistoryBodyParts));
  })
  
  test('Should successfully find every passive skill history in date range', async () => {
    const beginning = '2022-07-03 15:00:00 GMT-3';
    const ending = '2022-07-03 16:00:00 GMT-3';
    const dummyPassiveSkillJoinedWithHistoryBodyParts = {
      passive_skill_id: 'passiveId-01',
      title: 'Dummy PassiveSkill 1',
      description: 'PassiveSkill description',
      boost: 3
    }
    const { records } = await PassiveSkillsRepo.findPassiveSkillsHistoryInDateRange(beginning, ending);

    expect(records.length).toBeGreaterThanOrEqual(3);
    records.forEach(record => expect(record).toMatchObject(dummyPassiveSkillJoinedWithHistoryBodyParts));
  })
  
  test('Should successfully create one passive skill', async () => {
    const dummyPassiveSkill: IPassiveSkill = {
      title: 'Dummy PassiveSkill create test',
      description: 'PassiveSkill description',
      type: 'passive',
      boost: 5,
      stage: 0,
      state: 'sleep'
    }

    await PassiveSkillsRepo.insertOnePassiveSkill(dummyPassiveSkill);
    const { record } = await PassiveSkillsRepo.findOnePassiveSkillByTitle(dummyPassiveSkill.title);

    expect(record).toMatchObject(dummyPassiveSkill);
  });
  
  test('Should successfully update one passive skill', async () => {
    const dummyIdentifier = 'passiveId-03';
    const dummyPassiveSkillBodyParts = {
      boost: 9
    };

    await PassiveSkillsRepo.updateOnePassiveSkill(dummyIdentifier, dummyPassiveSkillBodyParts);
    const { record } = await PassiveSkillsRepo.findOnePassiveSkill(dummyIdentifier);

    expect(record.boost).toBe(dummyPassiveSkillBodyParts.boost);
  });

  test('Should successfully update one passive skill', async () => {
    const dummyIdentifier = 'passiveId-04';
    const dummyPassiveSkillBodyParts = {
      boost: 9,
      stage: 3
    };

    await PassiveSkillsRepo.updateOnePassiveSkill(dummyIdentifier, dummyPassiveSkillBodyParts);
    const { record } = await PassiveSkillsRepo.findOnePassiveSkill(dummyIdentifier);

    expect(record).toMatchObject(dummyPassiveSkillBodyParts);
  });
  
  test('Should successfully delete one passive skill', async () => {
    const dummyIdentifier = 'passiveId-07';

    await PassiveSkillsRepo.deleteOnePassiveSkill(dummyIdentifier);
    const { records } = await PassiveSkillsRepo.findOnePassiveSkill(dummyIdentifier);

    expect(records.length).toBe(0);
  });
})
