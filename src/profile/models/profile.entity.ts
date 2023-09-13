import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  Sex,
  BodyBuild,
  EyeColor,
  Character,
  FamilyStatus,
  Orientation,
} from 'src/profile/types/profile';

import { Photos } from './photo.entity';
import { Users } from 'src/users/models/users.entity';

@Entity()
export class Profiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  firstName: string;

  @OneToOne(() => Users, { nullable: false })
  @JoinColumn()
  user: Users;

  @OneToMany(() => Photos, (photo) => photo.profile, { nullable: true })
  photos: Photos[];

  @Column({
    type: 'date',
    nullable: false,
  })
  birthday: Date;

  @Column({
    type: 'enum',
    enum: Sex,
    nullable: false,
  })
  sex: Sex;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  height: number;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  weight: number;

  @Column({
    type: 'enum',
    enum: BodyBuild,
    nullable: true,
    default: null,
  })
  bodyBuild: BodyBuild;

  @Column({
    type: 'enum',
    enum: EyeColor,
    nullable: true,
    default: null,
  })
  eyeColor: EyeColor;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  aboutMe: string;

  // ??? Интерессы ???

  @Column({
    type: 'enum',
    enum: Character,
    nullable: true,
    default: null,
  })
  character: Character;

  @Column({
    type: 'enum',
    enum: FamilyStatus,
    nullable: true,
    default: null,
  })
  familyStatus: FamilyStatus;

  @Column({
    type: 'enum',
    enum: Orientation,
    nullable: true,
    default: null,
  })
  orientation: Orientation;

  // ??? Хочу Найти ???
}
