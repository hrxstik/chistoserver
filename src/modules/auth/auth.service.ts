import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../../dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../users/user.repository';
import { LoginUserDto } from '../../dto/login-user-dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(dto: RegisterUserDto) {
    if (dto.password !== dto.passwordRepeat) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const { passwordRepeat, ...userCreateData } = {
      ...dto,
      password: hashedPassword,
    };

    return this.userRepository.createUser(userCreateData);
  }

  async login(dto: LoginUserDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    const isPasswordValid = user
      ? await bcrypt.compare(dto.password, user.password)
      : false;
    if (!isPasswordValid || !user) {
      throw new UnauthorizedException('Invalid password or email');
    }

    const { password, ...userData } = user;
    return userData;
  }
}
