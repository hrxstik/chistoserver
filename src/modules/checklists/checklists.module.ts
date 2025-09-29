import { Module } from '@nestjs/common';
import { ChecklistsService } from './checklists.service';
import { ChecklistsController } from './checklists.controller';
import { PushNotificationModule } from '../notifications/push-notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PushNotificationModule, PrismaModule, UsersModule],
  providers: [ChecklistsService, JwtService],
  controllers: [ChecklistsController],
})
export class ChecklistsModule {}
