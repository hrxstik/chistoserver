import { IsEmail, MinLength } from 'class-validator';

export class ConfirmCodeDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  code: string;
}
