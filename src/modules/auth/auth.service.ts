import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../../dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../dto/login-user.dto';
import { VerificationCodeRepository } from '../verification-code/verification-code.repository';
import { ResendService } from 'nestjs-resend';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository,
    private readonly resendService: ResendService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    if (dto.password !== dto.passwordRepeat) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const { passwordRepeat, ...userCreateData } = {
      ...dto,
      password: hashedPassword,
    };

    const createdUser = await this.usersRepository.createUser(userCreateData);

    const payload = { sub: createdUser.id, email: createdUser.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: createdUser };
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersRepository.findByEmail(dto.email);
    const isPasswordValid = user
      ? await bcrypt.compare(dto.password, user.password)
      : false;
    if (!isPasswordValid || !user) {
      throw new UnauthorizedException('Invalid password or email');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const { password, ...userData } = user;
    return { accessToken, user: userData };
  }

  async sendVerificationCode(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.verified) {
      throw new UnauthorizedException('Email is already verified');
    }

    await this.verificationCodeRepository.deleteByUserId(user.id);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.verificationCodeRepository.create({ userId: user.id, code });

    await this.resendService.send({
      from: 'onboarding@resend.dev',
      to: 'hisamov2004@gmail.com',
      subject: 'Подтверждение почты в ChistoPRO',
      html: `<p>Ваш код для подтверждения:<strong>${code}</strong></p>`,
    });
  }

  async confirmCode(email: string, code: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const savedCode = await this.verificationCodeRepository.findByUserId(
      user.id,
    );

    if (!savedCode || savedCode.code !== code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    await this.verificationCodeRepository.deleteByUserId(user.id);

    await this.usersRepository.update(user.id, {
      verified: new Date(),
      provider: 'chistopro',
    });
  }
}
