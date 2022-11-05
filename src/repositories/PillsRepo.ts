import { INewPill, IPills } from "../features/interfaces/interfaces";
import { buildSearchString, uniqueIdentifier } from "./FeatsRepo";
import { NoSQLRepository } from "./RepoResultHandler";

class PillsRepo extends NoSQLRepository<IPills> {
  async findAllTakeablePills() {
    const pills = await this.collection().find({
      next_shot: {$lte: new Date()}
    }).toArray();

    return pills;
  }

  async findAllPills() {
    const pills = await this.collection().find({}).toArray();
    return pills;
  }

  async findOnePill(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);
    const pills = await this.collection().findOne(searchParams);
    return pills;
  }

  async updatePill(identifier: uniqueIdentifier, next_shot: Date) {
    const searchParams = buildSearchString(identifier);

    await this.collection().updateOne(searchParams, {
      $inc: {
        times_taken: 1
      },
      $set: {
        next_shot
      },
      $push: {
        history: new Date()
      }
    })
  }

  async insertOnePill(properties: INewPill) {
    const {
      name,
      description
    } = properties;

    await this.collection().insertOne({
      name,
      immune: false,
      description,
      times_taken: 0,
      next_shot: new Date(),
      history: []
    });
  }

  async deleteOnePill(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);
    await this.collection().deleteOne(searchParams);
  }
}



export default new PillsRepo('leveling', 'pills');