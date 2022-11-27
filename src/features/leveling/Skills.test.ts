import { closeDb, initMongoDB } from '../../infra/database/mongodb';
import SkillsRepo from '../../repositories/leveling/SkillsRepo';
import { BadRequest } from '../../util/errors/HttpStatusCode';
import { Skills } from './Skills';

describe('Skills busines logic', () => {
  const dummySkill01 = {
    name: 'skill 01',
    description: 'Description of one skill',
    created_at: new Date(),
  }

  const dummySkill02 = {
    ...dummySkill01,
    name: 'skill 02'
  }

  const dummySkill03 = {
    ...dummySkill01,
    name: 'skill 03'
  }

  beforeAll(async () => {
    await initMongoDB();
  });

  beforeEach(async () => {
    await SkillsRepo.wipeCollection();
    await SkillsRepo.insertOneSkill(dummySkill01);
    await SkillsRepo.insertOneSkill(dummySkill02);
    await SkillsRepo.insertOneSkill(dummySkill03);
  });

  afterAll(async () => {
    await closeDb();
  });

  test('Should return all existing skills', async () => {
    const skills = await Skills.getAllSkills();
    expect(skills.length).toBe(3);
  });
  
  test('Should return one specified existing skills', async () => {
    const skill_id = (await Skills.getAllSkills())![0]._id.toHexString();
    const skill = await Skills.getOneSkills(skill_id);

    expect(skill).toMatchObject(dummySkill01);
  });
  
  test('Should throw Bad Request uppon invalide skill_id ', async () => {
    const skill_id = 'invalid_id';
    const getSkill = async () => await Skills.getOneSkills(skill_id);

    await expect(getSkill).rejects.toThrow(new BadRequest('Invalid skill_id'));
  });

  test('Should successfully create a new skill', async () => {
    await SkillsRepo.wipeCollection();
    const dummySkill = {
      name: 'Skill',
      description: 'Description'
    }
    await Skills.createNewSkill(dummySkill);
    const newSkill = (await Skills.getAllSkills())![0]
    expect(newSkill).toMatchObject(dummySkill);
  });
  
  test('Should throw Bad Request if try to insert already existing skill name', async () => {
    const dummySkill = {
      name: 'skill 01',
      description: 'Description'
    }
    const createSkill = async () => await Skills.createNewSkill(dummySkill);
    await expect(createSkill).rejects.toThrow(new BadRequest('Skill name chosen already exist'));
  });
  
  test('Should successfuly delete skill', async () => {
    const skill_id = (await Skills.getAllSkills())![0]._id.toHexString();
    await Skills.deleteSkill(skill_id);
    const skill = await Skills.getOneSkills(skill_id);

    expect(skill).toBe(null);
  });

  test('Should throw Bad Request uppon invalide skill_id ', async () => {
    const skill_id = 'invalid_id';
    const deleteSkill = async () => await Skills.deleteSkill(skill_id);

    await expect(deleteSkill).rejects.toThrow(new BadRequest('Invalid skill_id'));
  });
})