import { Gender, Profession } from '@prisma/client';
import { PetType } from '../enums';

export interface Roommate {
  gender: Gender;
  age: number;
  profession: Profession;
}

export interface Pet {
  type: PetType;
}
