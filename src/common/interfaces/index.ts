import { Profession } from '@prisma/client';

export interface Roommate {
  age: number;
  profession: Profession;
}
