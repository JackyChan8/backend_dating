import { Dialogs } from '../modules/dialog/models/dialog.entity';

export interface DialogCreateInterface {
  author: number;
  partner: number;
  message: string;
}

export interface MessageCreateInterface {
  author: number;
  text: string;
  dialog: number;
}

export interface GetDialogsResponse {
  status: number;
  message: string;
  data?: Dialogs | Dialogs[];
}

export interface GetMessagesInterface {
  dialogID: number;
  userID: number;
}

export interface MessagesReadInterface {
  user: number;
  dialog: number;
}
