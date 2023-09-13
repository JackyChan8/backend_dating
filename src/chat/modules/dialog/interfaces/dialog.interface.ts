import { MessageInterface } from 'src/chat/modules/message/interfaces/message.interface';

export interface DialogInterface {
  author: number;
  partner: number;
  message: string;
}

export interface DialogResInterface {
  status: number;
  message: string;
  data?: MessageInterface;
}
