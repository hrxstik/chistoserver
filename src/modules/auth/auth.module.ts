import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';

@Module({
  imports: [PrismaModule, VerificationCodeModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  exports: [AuthService],
})
export class AuthModule {}
