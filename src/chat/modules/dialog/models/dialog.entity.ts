import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Users } from 'src/users/models/users.entity';

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

  async length() {
    return Dialogs.length;
  }
}
