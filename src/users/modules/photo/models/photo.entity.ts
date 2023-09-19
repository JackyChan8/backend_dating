import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Users } from 'src/users/models/users.entity';

@Entity()
export class Photos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @ManyToOne(() => Users, (user) => user.photos)
  user: Users;
}
