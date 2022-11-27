
import { INewSkill } from '../../features/interfaces/interfaces'
import { isObjectId } from '../../infra/database/mongodb';
import SkillsRepo from '../../repositories/leveling/SkillsRepo';
import { BadRequest } from '../../util/errors/HttpStatusCode';

export class Skills {
  static getAllSkills = () => SkillsRepo.findAllSkills();

  static async getOneSkills(skill_id: string) {
    if (!isObjectId(skill_id))
      throw new BadRequest('Invalid skill_id');
      
    return await SkillsRepo.findOneSkill(skill_id);
  }

  static async createNewSkill(props: INewSkill) {
    const reqBody = {
      name: props.name,
      description: props.description,
      created_at: new Date()
    };

    await SkillsRepo.insertOneSkill(reqBody);
  }

  static async deleteSkill(skill_id: string) {
    if (!isObjectId(skill_id))
      throw new BadRequest('Invalid skill_id');

    SkillsRepo.deleteOneSkill(skill_id)
  }
}