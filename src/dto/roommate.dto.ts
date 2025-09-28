import { IsEnum, IsInt } from 'class-validator';
import { Profession } from '@prisma/client';

export class RoommateDto {
  @IsInt()
  age: number;

  @IsEnum(Profession)
  profession: Profession;
}
