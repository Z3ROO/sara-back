import { isObjectId } from "../../infra/database/mongodb";
import InboxRepo from "../../repositories/leveling/InboxRepo";
import { BadRequest } from "../../util/errors/HttpStatusCode";

export default class Inbox {
  static async getRawInbox() {
    const items = await InboxRepo.findRawInboxItems();
    return items.map(({_id, content}) => ({_id, content}));
  }

  static async getReviewedInbox() {
    const items = await InboxRepo.findReviewedInboxItems();
    return items.map(({_id, content}) => ({_id, content}));
  }

  static async getInbox() {
    const items = await InboxRepo.findAllInboxItems();
    return items;
  }

  static async getOneInboxItem(inbox_item_id: string) {
    if (!isObjectId(inbox_item_id))
      throw new BadRequest('Invalid inbox_item_id');

    const item = await InboxRepo.findOneInboxItem(inbox_item_id);
    return item;
  }

  static async addNewInboxItem(content: string) {
    if (!content)
      throw new BadRequest('Property "content" is missing')
    
    await InboxRepo.insertNewInboxItem({
      content,
      reviewed: false,
      nextReview: new Date()
    });
  }

  static async reviewInboxItem(inbox_item_id: string, content: string) {
    if (!isObjectId(inbox_item_id))
      throw new BadRequest('Invalid inbox_item_id');

    if (!content)
      throw new BadRequest('Property "content" is missing')

    await InboxRepo.updateOneInboxItem(inbox_item_id, {
      content,
      reviewed: true,
      nextReview: new Date()
    });
  }

  static async deferInboxItem(inbox_item_id: string, content: string) {
    if (!isObjectId(inbox_item_id))
      throw new BadRequest('Invalid inbox_item_id');

    if (!content)
      throw new BadRequest('Property "content" is missing')

    await InboxRepo.updateOneInboxItem(inbox_item_id, {
      content,
      nextReview: new Date(Date.now() + (12*60*60*1000))
    });
  }

  static async deleteInboxItem(inbox_item_id: string) {
    if (!isObjectId(inbox_item_id))
      throw new BadRequest('Invalid inbox_item_id');

    await InboxRepo.deleteOneInboxItem(inbox_item_id);
  }
}