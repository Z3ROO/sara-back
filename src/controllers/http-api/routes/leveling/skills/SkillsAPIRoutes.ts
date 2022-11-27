import { Request } from 'express';
import {Skills} from '../../../../../features/leveling/Skills';

export default [
  {
    method: 'get', path: '/leveling/skills',
    handler: async () => {
      const skills = await Skills.getAllSkills();

      return {
        body: skills
      }
    }
  },
  {
    method: 'get', path: '/leveling/skills/:skill_id',
    handler: async (req: Request) => {
      const { skill_id } = req.params
      const skill = await Skills.getOneSkills(skill_id);

      return {
        body: skill
      }
    }
  },
  {
    method: 'post', path: '/leveling/skills/new', 
    handler: async (req: Request) => {
      const { name, description } = req.body;

      await Skills.createNewSkill({name, description})

      return {
        status: 201,
        message: 'Skill created'
      }
    }
  },
  {
    method: 'delete', path: '/leveling/skills/:skill_id', 
    handler: async (req: Request) => {
      const { skill_id } = req.params
      await Skills.deleteSkill(skill_id);

      return {
        status: 202,
        message: 'Skill deleted'
      }
    }
  }
]