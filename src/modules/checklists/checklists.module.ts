import { Module } from '@nestjs/common';
import { ChecklistsService } from './checklists.service';
import { ChecklistsController } from './checklists.controller';
import { PushNotificationModule } from '../notifications/push-notifications.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PushNotificationModule, PrismaModule],
  providers: [ChecklistsService],
  controllers: [ChecklistsController],
})
export class ChecklistsModule {}
