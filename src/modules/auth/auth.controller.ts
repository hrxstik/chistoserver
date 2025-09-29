import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../../dto/register-user.dto';
import { LoginUserDto } from 'src/dto/login-user-dto';
import { ConfirmCodeDto } from 'src/dto/confirm-code-dto';
import { SendCodeDto } from 'src/dto/send-code-dto';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard)
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
    try {
      await this.authService.sendVerificationCode(dto.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return { message: 'Код подтверждения отправлен' };
  }

  @Post('confirm-code')
  async confirmCode(@Body() dto: ConfirmCodeDto) {
    if (!dto.email || !dto.code) {
      throw new BadRequestException('Email and code are required');
    }
    try {
      await this.authService.confirmCode(dto.email, dto.code);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return { message: 'Почта подтвеждена' };
  }
}
