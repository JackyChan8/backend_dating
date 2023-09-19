import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Users } from 'src/users/models/users.entity';
import { Messages } from '../../message/models/message.entity';

@Entity()
export class Dialogs {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users)
  author: Users;

  @ManyToOne(() => Users)
  partner: Users;

  @Column({
    name: 'lastMessage',
    type: 'text',
  })
  lastMessage: string;

  @OneToMany(() => Messages, (msg) => msg.dialog, { nullable: true })
  messages: Messages;

  async length() {
    return Dialogs.length;
  }
}
