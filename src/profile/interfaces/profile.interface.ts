import {
  Sex,
  BodyBuild,
  EyeColor,
  Character,
  FamilyStatus,
  Orientation,
} from 'src/profile/types/profile';

export interface ProfileCreateInterface {
  firstName: string;
  birthday: Date;
  sex: Sex;
  height: number;
  weight: number;
  bodyBuild: BodyBuild;
  eyeColor: EyeColor;
  aboutMe: string;
  character: Character;
  familyStatus: FamilyStatus;
  orientation: Orientation;
}
