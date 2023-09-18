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
import { Profiles } from '../models/profile.entity';

export interface ProfileCreateInterface {
  firstName: string;
  birthday: Date;
  sex: Sex;
  height: number;
  weight: number;
  bodyBuild: BodyBuild;
  eyeColor: EyeColor;
  aboutMe: string;
  interests: Interests[];
  character: Character;
  familyStatus: FamilyStatus;
  orientation: Orientation;
  looking: Looking[];
  qualities: Qualities[];
  partnerDesc: string;
}

export interface ProfileUpdateInterface {
  sex: Sex;
  height: number;
  weight: number;
  bodyBuild: BodyBuild;
  eyeColor: EyeColor;
  aboutMe: string;
  interests: Interests[];
  character: Character;
  familyStatus: FamilyStatus;
  orientation: Orientation;
  looking: Looking[];
  qualities: Qualities[];
  partnerDesc: string;
}

export interface ProfileResInterface {
  status: number;
  message: string;
  data?: Profiles;
}
