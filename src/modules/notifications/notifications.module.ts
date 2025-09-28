import { Module } from '@nestjs/common';
import { PushNotificationService } from './notifications.service';

@Module({})
export class NotificationsModule {
  providers: [PushNotificationService];
}
