import { ApiProperty } from '@nestjs/swagger';
import {
  Sex,
  BodyBuild,
  EyeColor,
  Character,
  FamilyStatus,
  Orientation,
} from 'src/profile/types/profile';

export class CreateProfileDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  birthday: Date;

  @ApiProperty()
  sex: Sex;

  @ApiProperty()
  height: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  bodyBuild: BodyBuild;

  @ApiProperty()
  eyeColor: EyeColor;

  @ApiProperty()
  aboutMe: string;

  @ApiProperty()
  character: Character;

  @ApiProperty()
  familyStatus: FamilyStatus;

  @ApiProperty()
  orientation: Orientation;
}
