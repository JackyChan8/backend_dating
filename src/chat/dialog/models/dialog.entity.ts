import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from 'src/users/models/users.entity';

@Entity()
export class Dialog {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users)
  @JoinColumn()
  author: Users;

  @OneToOne(() => Users)
  @JoinColumn()
  partner: Users;

  @Column({
    name: 'last_message',
    type: 'text',
  })
  lastMessage: string;
}
