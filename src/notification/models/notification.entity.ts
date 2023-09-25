import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Users } from 'src/users/models/users.entity';

import { TypeNotification } from '../types/notification';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TypeNotification,
    nullable: false,
  })
  type: TypeNotification;

  @ManyToOne(() => Users)
  user: Users;

  @Column({
    type: 'text',
    nullable: false,
  })
  text: string;

  @Column({ default: true })
  show: boolean;

  @CreateDateColumn()
  created_at: Date;
}
