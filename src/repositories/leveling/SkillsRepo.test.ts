import { closeDb, initMongoDB } from "../../infra/database/mongodb"
import SkillsRepo from './SkillsRepo'

describe('Skills Repositories', () => {
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

  test('Should retrieve all existing skills', async () => {
    const skills = await SkillsRepo.findAllSkills();
    
    expect(skills.length).toBe(3);
  });

  test('Should retrieve one specified skill', async () => {
    const skill_id = (await SkillsRepo.findAllSkills())![0]._id.toHexString();
    const skill = await SkillsRepo.findOneSkill(skill_id);
    
    expect(skill).toMatchObject(dummySkill01);
  });

  test('Should insert skill', async () => {
    await SkillsRepo.wipeCollection();

    const dummySkill = {
      ...dummySkill01,
      title: 'new skill',
    };

    await SkillsRepo.insertOneSkill(dummySkill);
    const newSkill = (await SkillsRepo.findAllSkills())[0];

    expect(newSkill).toMatchObject(dummySkill);
  });

  test('Should update skill properties', async () => {
    const description = 'new description'
    const skill_id = (await SkillsRepo.findAllSkills())![0]._id.toHexString();
    await SkillsRepo.updateSkillProps(skill_id, {description});
    const updtedSkill = await SkillsRepo.findOneSkill(skill_id);

    expect(updtedSkill!.description).toBe(description);
  });

  test('Should delete one skill', async () => {
    const skill_id = (await SkillsRepo.findAllSkills())![0]._id.toHexString();
    await SkillsRepo.deleteOneSkill(skill_id);
    const deletedSkill = await SkillsRepo.findOneSkill(skill_id);

    expect(deletedSkill).toBe(null)
  })
})