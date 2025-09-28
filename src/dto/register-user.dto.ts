import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsInt,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Profession, HomeArea } from '@prisma/client';
import { Type } from 'class-transformer';
import { RoomDto } from './room.dto';
import { RoommateDto } from './roommate.dto';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  passwordRepeat: string;

  @IsInt()
  age: number;

  @IsEnum(HomeArea)
  homeArea: HomeArea;

  @IsEnum(Profession)
  profession: Profession;

  @IsString()
  timeZone: string;

  @ValidateNested({ each: true })
  @Type(() => RoommateDto)
  roommates: RoommateDto[];

  @IsInt()
  pets: number;

  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms: RoomDto[];
}
