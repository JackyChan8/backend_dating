import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length, IsNotEmpty, IsEmail } from 'class-validator';

import * as bcrypt from 'bcrypt';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
