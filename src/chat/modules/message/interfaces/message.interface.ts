import { Messages } from '../models/message.entity';

export interface MessageInterface {
  author: number;
  text: string;
  dialog: number;
}

export interface MessageResInterface {
  status: number;
  message: string;
  data?: Messages;
}
