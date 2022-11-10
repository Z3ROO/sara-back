import { Request } from "express";
import Inbox from "../../../../../features/leveling/Inbox";

export default [
  {
    method: 'get', path: '/leveling/inbox',
    handler: async () => {
      const items = await Inbox.getInbox();

      return {
        body: items
      }
    }
  },
  {
    method: 'get', path: '/leveling/inbox/raw',
    handler: async () => {
      const items = await Inbox.getRawInbox();

      return {
        body: items
      }
    }
  },
  {
    method: 'get', path: '/leveling/inbox/reviewed',
    handler: async () => {
      const items = await Inbox.getReviewedInbox();

      return {
        body: items
      }
    }
  },
  {
    method: 'post', path: '/leveling/inbox/new',
    handler: async (req: Request) => {
      const { content } = req.body;

      await Inbox.addNewInboxItem(content);

      return {
        status: 201,
        message: 'Inbox item created'
      }
    }
  },
  {
    method: 'post', path: '/leveling/inbox/review/:inbox_item_id',
    handler: async (req: Request) => {
      const { inbox_item_id } = req.params;
      const { content } = req.body;

      await Inbox.reviewInboxItem(inbox_item_id, content);

      return {
        status: 202,
        message: 'Inbox item reviewed'
      }
    }
  },
  {
    method: 'post', path: '/leveling/inbox/defer/:inbox_item_id',
    handler: async (req: Request) => {
      const { inbox_item_id } = req.params;
      const { content } = req.body;

      await Inbox.deferInboxItem(inbox_item_id, content);

      return {
        status: 202,
        message: 'Inbox item defered'
      }
    }
  },
  {
    method: 'delete', path: '/leveling/inbox/:inbox_item_id',
    handler: async (req: Request) => {
      const { inbox_item_id } = req.params;
      await Inbox.deleteInboxItem(inbox_item_id);

      return {
        status: 202,
        message: 'Inbox item deleted'
      }
    }
  },
  {
    method: 'get', path: '/leveling/inbox',
    handler: async () => {

    }
  },
  {
    method: 'get', path: '/leveling/inbox',
    handler: async () => {

    }
  }
];