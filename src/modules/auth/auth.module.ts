import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  imports: [
    PrismaModule,
    VerificationCodeModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
