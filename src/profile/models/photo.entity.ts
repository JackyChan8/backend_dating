import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profiles } from './profile.entity';

@Entity()
export class Photos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Profiles, (profile) => profile.photos)
  profile: Profiles;
}
