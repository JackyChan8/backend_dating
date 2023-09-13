import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { Dialogs } from 'src/chat/modules/dialog/models/dialog.entity';
import { Users } from 'src/users/models/users.entity';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  text: string;

  @ManyToOne(() => Dialogs)
  dialog: Dialogs;

  @ManyToOne(() => Users)
  author: Users;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  async length() {
    return Messages.length;
  }
}
