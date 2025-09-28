import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { PushNotificationsService } from '../notifications/push-notifications.service';

@Injectable()
export class ChecklistsService {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly prisma: PrismaService,
  ) {}
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    //После отправки и сброса чеклистов в 7 утра создаем новые
    await this.pushNotificationsService.checkAndNotifyUsersAtHour(7);

    const nowUtc = new Date();
    const users = await this.prisma.user.findMany({
      include: { checklist: true },
    });

    const tasks = await this.prisma.task.findMany();

    for (const user of users) {
      const userTime = new Date(
        nowUtc.toLocaleString('en-US', { timeZone: user.timeZone }),
      );

      //TODO: логика выбора заданий
      if (userTime.getHours() === 7) {
        const shuffledTasks = tasks.sort(() => 0.5 - Math.random());
        const selectedTasks = shuffledTasks.slice(0, 3);

        await this.prisma.checklist.update({
          where: { userId: user.id },
          data: {
            tasks: {
              set: [],
              connect: selectedTasks.map((task) => ({ id: task.id })),
            },
          },
        });
      }
    }
  }
}
