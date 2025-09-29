import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.checkAndNotifyUsersAtHour(20);
  }

  async checkAndNotifyUsersAtHour(hour: number) {
    const nowUtc = new Date();
    const users = await this.prisma.user.findMany({
      include: { checklist: true },
    });

    for (const user of users) {
      const userTime = new Date(
        nowUtc.toLocaleString('en-US', { timeZone: user.timeZone }),
      );

      if (userTime.getHours() === hour) {
        await this.prisma.$transaction(async (tx) => {
          const checklist = await tx.checklist.findUnique({
            where: { userId: user.id },
          });

          if (checklist && !checklist.isCompleted) {
            const pushTokens = JSON.parse(user.pushTokens || '[]');
            let title = '';
            let body = '';

            if (hour === 7) {
              title = 'Ваш Чубрик ушел';
              body = 'Не забудьте выполнить чеклист сегодня!';
            } else if (hour === 20) {
              title = 'У вас есть незаконченные задания';
              body = 'Не забудьте их выполните, иначе ваш чубрик уйдет!';
            }

            for (const token of pushTokens) {
              await this.sendPushNotification(token, title, body);
            }
          }
        });
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
      const response = await this.firebaseAdmin.messaging().send(message);
      this.logger.log(`Push notification sent successfully: ${response}`);
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error}`);
    }
  }
}
