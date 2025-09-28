import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../../dto/register-user.dto';
import { AppTokenGuard } from 'src/guards/app-token-guard';
import { LoginUserDto } from 'src/dto/login-user-dto';
import { ConfirmCodeDto } from 'src/dto/confirm-code-dto';
import { SendCodeDto } from 'src/dto/send-code-dto';

@UseGuards(AppTokenGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('send-code')
  async sendCode(@Body() dto: SendCodeDto) {
    if (!dto.email) {
      throw new BadRequestException('Email is required');
    }
    await this.authService.sendVerificationCode(dto.email);
    return { message: 'Код подтверждения отправлен' };
  }

  @Post('confirm-code')
  async confirmCode(@Body() dto: ConfirmCodeDto) {
    if (!dto.email || !dto.code) {
      throw new BadRequestException('Email and code are required');
    }
    await this.authService.confirmCode(dto.email, dto.code);
    return { message: 'Почта подтвеждена' };
  }
}
