import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';

import { Photos } from 'src/users/modules/photo/models/photo.entity';
import { Profiles } from 'src/profile/models/profile.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 200,
    unique: true,
  })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'Email обязательный' })
  email: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  @Length(8, 200, {
    message: 'Пароль должен быть минимум 8 символов и максимум 200 символов',
  })
  @IsNotEmpty({ message: 'Пароль обязательный' })
  password: string;

  @Column({ default: false })
  confirm_email: boolean;

  @OneToOne(() => Profiles, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: Profiles;

  @OneToMany(() => Photos, (photo) => photo.user, { nullable: true })
  photos: Photos[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
