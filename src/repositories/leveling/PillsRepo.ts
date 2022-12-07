import { ObjectId } from "mongodb";
import { IPills } from "../../features/interfaces/interfaces";
import { NoSQLRepository } from "../RepoResultHandler";

class PillsRepo extends NoSQLRepository<IPills> {

  async findAllPills() {
    const pills = await this.collection().find({}).toArray();
    return pills;
  }

  async findAllTakeablePills() {
    const pills = await this.collection().find({
      next_shot: {$lte: new Date()}
    }).sort({next_shot: 1}).toArray();

    return pills;
  }

  async findOnePill(pill_id: string) {
    const _id = new ObjectId(pill_id);
    const pills = await this.collection().findOne({_id});
    return pills;
  }

  async updatePill(pill_id: string, next_shot: Date, increment:number) {
    const _id = new ObjectId(pill_id);

    await this.collection().updateOne({_id}, {
      $inc: {
        times_taken: increment
      },
      $set: {
        next_shot
      },
      $push: {
        history: {increment, date: new Date()}
      }
    })
  }

  async insertOnePill(properties: IPills) {
    await this.collection().insertOne(properties);
  }

  async deleteOnePill(pill_id: string) {
    const _id = new ObjectId(pill_id);
    await this.collection().deleteOne({_id});
  }
}

export default new PillsRepo('leveling', 'pills');
