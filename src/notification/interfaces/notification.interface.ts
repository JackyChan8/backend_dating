import { TypeNotification } from "../types/notification";

type Author = {
  id: number;
  firstName: string;
};

export interface NotifyCreateInterface {
  author: Author;
  partnerId: number;
  dialogId: number;
  type: TypeNotification;
  text: string;
}

export interface CreateNotification {
  authorId: number;
  dialogId: number;
}
