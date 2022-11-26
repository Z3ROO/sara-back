import { ObjectId } from "mongodb";
import { ISkill } from "../../features/interfaces/interfaces";
import { NoSQLRepository } from "../RepoResultHandler";

class SkillsRepo extends NoSQLRepository<ISkill>{
  async findAllSkills() {
    const skills = await this.collection().find({}).toArray();
    return skills;
  }

  async findOneSkill(skill_id: string) {
    const skill = await this.collection().findOne({_id: new ObjectId(skill_id)});
    return skill
  }

  async insertOneSkill(skill: ISkill) {
    await this.collection().insertOne(skill);
  }

  async updateSkillProps(skill_id: string, props: Partial<ISkill>) {
    await this.collection().updateOne(
      {_id: new ObjectId(skill_id)},
      {$set: props}
    );
  }

  async deleteOneSkill(skill_id: string) {
    await this.collection().deleteOne({_id: new ObjectId(skill_id)});
  }
}

export default new SkillsRepo('leveling', 'skills')