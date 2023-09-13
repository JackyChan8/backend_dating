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
