import { IPills } from "../features/interfaces/interfaces";
import { buildSearchString, uniqueIdentifier } from "./FeatsRepo";
import { NoSQLRepository } from "./RepoResultHandler";

class PillsRepo extends NoSQLRepository<IPills> {
  async findAllPills() {
    const records = await this.collection().find().toArray();
    return { records };
  }

  async findOnePills(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);
    const record = await this.collection().findOne(searchParams);
    return {record}
  }

  async insertOnePill(properties: Partial<IPills>) {
    const {
      name,
      description,
      times_taken,
      last_taken,
    } = properties;

    await this.collection().insertOne({
      name,
      description,
      times_taken: null,
      last_taken: null
    })
  }

  async deleteOnePill(identifier: uniqueIdentifier) {
    const searchParams = buildSearchString(identifier);
    await this.collection().deleteOne(searchParams);
  }
}



export default new PillsRepo('leveling', 'pills');