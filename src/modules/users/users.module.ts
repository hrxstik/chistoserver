import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';
import { AchievementsService } from '../achievements/achievements.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository, UsersService, AchievementsService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
