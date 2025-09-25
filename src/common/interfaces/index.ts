import { EAchievementType, ERoom, ETaskType } from '../enums';

export interface IAchievement {
  id: number;
  name: string;
  levels: number[];
  type: EAchievementType;
  values: number[];
}

export interface ITask {
  id: number;
  type: ETaskType;
  room: ERoom;
  description: string;
  reward: number;
}
