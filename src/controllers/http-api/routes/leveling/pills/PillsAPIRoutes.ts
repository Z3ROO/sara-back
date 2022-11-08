import { Request } from "express";
import { INewPill } from "../../../../../features/interfaces/interfaces";
import Pills from "../../../../../features/leveling/Pills"
import { isObjectId } from "../../../../../infra/database/mongodb";
import { BadRequest } from "../../../../../util/errors/HttpStatusCode";
import { checkForMissingProperties } from "../../utils";

export default [
  {
    method: 'get', path: '/pills',
    handler: async () => {
      const pills = await Pills.getTakeablePills();

      return {
        body: pills,
      }
    }
  },
  {
    method: 'get', path: '/pills/all',
    handler: async () => {
      const pills = await Pills.getAllPills();

      return {
        body: pills
      }
    }
  },
  {
    method: 'get', path: '/pills/take/:pill_id',
    handler: async (req: Request) => {
      const { pill_id } = req.params;

      if (!isObjectId(pill_id))
        throw new BadRequest('Invalid pill_id');

      await Pills.takePill(pill_id)

      return {
        status: 202,
        message: 'Pill taken'
      }
    }
  },
  {
    method: 'post', path: '/pills/new', 
    handler: async (req: Request) => {
      const { name, description } = req.body;

      const pill: INewPill = {
        name,
        description
      }

      checkForMissingProperties(pill);

      await Pills.addNewPill(pill);

      return {
        status: 201,
        message: 'Pill added'
      }
    }
  }
]