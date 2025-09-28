import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  constructor(private readonly prisma: PrismaService) {
    admin.initializeApp({
      //TODO: FIREBASE ENV VARS
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey:
          process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
      }),
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const nowUtc = new Date();
    const users = await this.prisma.user.findMany({
      include: { checklist: true },
    });

    const notificationConfigs = [
      {
        hour: 7,
        title: 'Ваш Чубрик ушел',
        body: 'Не забудьте выполнить чеклист сегодня!',
      },
      {
        hour: 20,
        title: 'У вас есть незаконченные задания',
        body: 'Не забудьте их выполните, иначе ваш чубрик уйдет!',
      },
    ];

    for (const user of users) {
      const hasIncompleteChecklist =
        user.checklist && !user.checklist.isCompleted;
      if (!hasIncompleteChecklist) {
        continue;
      }

      const userTime = new Date(
        nowUtc.toLocaleString('en-US', { timeZone: user.timeZone }),
      );

      for (const config of notificationConfigs) {
        if (userTime.getHours() === config.hour) {
          this.logger.log(
            `Send notification to user ${user.id} at hour ${config.hour}`,
          );

          try {
            const pushTokens = JSON.parse(user.pushTokens);

            for (const pushToken of pushTokens) {
              await this.sendPushNotification(
                pushToken,
                config.title,
                config.body,
              );
            }
          } catch (e) {
            this.logger.error(
              `Error parsing pushTokens for user ${user.id}: ${e.message}`,
            );
          }
        }
      }
    }
  }

  async sendPushNotification(token: string, title: string, body: string) {
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`Push notification sent successfully: ${response}`);
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error}`);
    }
  }
}
