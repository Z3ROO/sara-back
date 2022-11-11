import { ObjectId } from "mongodb";
import { IInbox, IInboxItem } from "../../features/interfaces/interfaces";
import { NoSQLRepository } from "../RepoResultHandler";
const dbName = 'leveling';
const collectionName = 'inbox';
class InboxRepo extends NoSQLRepository<IInboxItem> {
  async findRawInboxItems() {
    const items = await this.collection().find({
      reviewed: false,
      nextReview: {$lte: new Date()}
    }).toArray();
    return items;
  }

  async findReviewedInboxItems() {
    const items = await this.collection().find({reviewed: true}).toArray();
    return items;
  }

  async findAllInboxItems() {
    const items = await this.collection().find().toArray();
    return items
  }

  async findOneInboxItem(inbox_item_id: string) {
    const _id = new ObjectId(inbox_item_id);
    return await this.collection().findOne({_id});
  }

  async insertNewInboxItem(properties: IInboxItem) {
    await this.collection().insertOne(properties);
  }

  async updateOneInboxItem(inbox_item_id: string, properties: Partial<IInboxItem>) {
    const _id = new ObjectId(inbox_item_id);
    await this.collection().updateOne({_id}, {$set: properties});
  }

  async deleteOneInboxItem(inbox_item_id: string) {
    const _id = new ObjectId(inbox_item_id);
    await this.collection().deleteOne({_id});
  }
}

export default new InboxRepo(dbName, collectionName);
