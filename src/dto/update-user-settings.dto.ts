import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HomeArea, Profession } from '@prisma/client';
import { Type } from 'class-transformer';
import { RoommateDto } from './roommate.dto';
import { RoomDto } from './room.dto';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(HomeArea)
  homeArea?: HomeArea;

  @IsOptional()
  @IsEnum(Profession)
  profession?: Profession;

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsOptional()
  pets?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoommateDto)
  roommates?: any[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms?: RoomDto[];
}
