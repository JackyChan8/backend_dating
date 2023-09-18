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
  Interests,
  Looking,
  Qualities,
} from 'src/profile/types/profile';

import { Photos } from './photo.entity';
import { Users } from 'src/users/models/users.entity';

@Entity()
export class Profiles {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, { nullable: false })
  @JoinColumn()
  user: Users;

  @OneToMany(() => Photos, (photo) => photo.profile, { nullable: true })
  photos: Photos[];

  // Основная Информация
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  firstName: string;

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

  // Личная Информация
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
    default: 'Не указывать',
  })
  bodyBuild: BodyBuild;

  @Column({
    type: 'enum',
    enum: EyeColor,
    default: 'Не указывать',
  })
  eyeColor: EyeColor;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  aboutMe: string;

  @Column({
    type: 'enum',
    enum: Interests,
    array: true,
    nullable: false,
  })
  interests: Interests[];

  @Column({
    type: 'enum',
    enum: Character,
    default: 'Не указывать',
  })
  character: Character;

  @Column({
    type: 'enum',
    enum: FamilyStatus,
    default: 'Не указывать',
  })
  familyStatus: FamilyStatus;

  @Column({
    type: 'enum',
    enum: Orientation,
    default: 'Не указывать',
  })
  orientation: Orientation;

  // Хочу Найти
  @Column({
    type: 'enum',
    enum: Looking,
    array: true,
    nullable: false,
    default: ['Не важно'],
  })
  looking: Looking[];

  @Column({
    type: 'enum',
    enum: Qualities,
    array: true,
    nullable: false,
    default: ['Не важно'],
  })
  qualities: Qualities[];

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  partnerDesc: string;
}
