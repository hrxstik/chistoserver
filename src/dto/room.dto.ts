import { IsEnum, IsInt } from 'class-validator';
import { RoomType } from '@prisma/client';

export class RoomDto {
  @IsEnum(RoomType)
  type: RoomType;

  @IsInt({ each: true })
  tasksStory: number[];
}
