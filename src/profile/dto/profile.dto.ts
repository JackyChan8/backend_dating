import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator';

import { Profiles } from '../models/profile.entity';

export class CreateProfileDto {
  @ApiProperty({
    type: String,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  readonly birthday: Date;

  @ApiProperty({
    type: String,
    enum: Sex,
    enumName: 'Sex',
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Sex)
  @IsString()
  readonly sex: Sex;

  @ApiProperty({
    type: Number,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly height: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly weight: number;

  @ApiProperty({
    type: String,
    enum: BodyBuild,
    enumName: 'BodyBuild',
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(BodyBuild)
  @IsString()
  readonly bodyBuild: BodyBuild;

  @ApiProperty({
    type: String,
    enum: EyeColor,
    enumName: 'EyeColor',
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(EyeColor)
  @IsString()
  readonly eyeColor: EyeColor;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
  })
  @IsString()
  readonly aboutMe: string;

  @ApiProperty({
    isArray: true,
    enum: Interests,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Interests, { each: true })
  readonly interests: Interests[];

  @ApiProperty({
    type: String,
    enum: Character,
    enumName: 'Character',
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Character)
  @IsString()
  readonly character: Character;

  @ApiProperty({
    type: String,
    enum: FamilyStatus,
    enumName: 'FamilyStatus',
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(FamilyStatus)
  @IsString()
  readonly familyStatus: FamilyStatus;

  @ApiProperty({
    type: String,
    enum: Orientation,
    enumName: 'Orientation',
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Orientation)
  @IsString()
  readonly orientation: Orientation;

  @ApiProperty({
    isArray: true,
    enum: Looking,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Looking, { each: true })
  readonly looking: Looking[];

  @ApiProperty({
    isArray: true,
    enum: Qualities,
    nullable: false,
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Qualities, { each: true })
  readonly qualities: Qualities[];

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
  })
  @IsString()
  readonly partnerDesc: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  readonly sex: Sex;

  @ApiPropertyOptional({
    type: Number,
    required: false,
  })
  readonly height: number;

  @ApiPropertyOptional({
    type: Number,
    required: false,
  })
  readonly weight: number;

  @ApiPropertyOptional({
    type: String,
    enum: BodyBuild,
    enumName: 'BodyBuild',
    required: false,
  })
  readonly bodyBuild: BodyBuild;

  @ApiPropertyOptional({
    type: String,
    enum: EyeColor,
    enumName: 'EyeColor',
    required: false,
  })
  readonly eyeColor: EyeColor;

  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  readonly aboutMe: string;

  @ApiPropertyOptional({
    enum: Interests,
    enumName: 'Interests',
    isArray: true,
    required: false,
  })
  readonly interests: Interests[];

  @ApiPropertyOptional({
    type: String,
    enum: Character,
    enumName: 'Character',
    required: false,
  })
  readonly character: Character;

  @ApiPropertyOptional({
    type: String,
    enum: FamilyStatus,
    enumName: 'FamilyStatus',
    required: false,
  })
  readonly familyStatus: FamilyStatus;

  @ApiPropertyOptional({
    type: String,
    enum: Orientation,
    enumName: 'Orientation',
    required: false,
  })
  readonly orientation: Orientation;

  @ApiPropertyOptional({
    enum: Looking,
    enumName: 'Looking',
    isArray: true,
    required: false,
  })
  readonly looking: Looking[];

  @ApiPropertyOptional({
    enum: Qualities,
    enumName: 'Qualities',
    isArray: true,
    required: false,
  })
  readonly qualities: Qualities[];

  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  readonly partnerDesc: string;
}

export class ProfileResDto {
  readonly status: number;
  readonly message: string;
  readonly data?: Profiles;
}
