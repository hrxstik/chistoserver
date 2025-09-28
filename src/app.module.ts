import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PushNotificationService } from './modules/notifications/notifications.service';
import { ChecklistsModule } from './modules/checklists/checklists.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChecklistsModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, PushNotificationService],
})
export class AppModule {}
