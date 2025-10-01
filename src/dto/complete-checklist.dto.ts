import { IsInt, IsNotEmpty } from 'class-validator';

export class CompleteChecklistDto {
  @IsInt()
  @IsNotEmpty()
  readonly checklistId: number;
}
