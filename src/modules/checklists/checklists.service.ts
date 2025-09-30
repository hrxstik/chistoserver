import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { PushNotificationsService } from '../notifications/push-notifications.service';
import { UsersService } from '../users/users.service';
import { Checklist, Prisma, Room, Task, User } from '@prisma/client';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    checklist: true;
    rooms: true;
  };
}>;

@Injectable()
export class ChecklistsService {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    //После отправки и сброса чеклистов в 7 утра создаем новые
    await this.usersService.updateUsersChubrikAndChecklistState();
    await this.pushNotificationsService.checkAndNotifyUsersAtHour(7);

    const users = await this.prisma.user.findMany({
      include: { checklist: true, rooms: true },
    });
    const tasks = await this.prisma.task.findMany();
    const nowUtc = new Date();
    for (const user of users) {
      await this.createChecklist(user, nowUtc, tasks);
    }
  }

  async createChecklist(user: UserWithRelations, nowUtc: Date, tasks: Task[]) {
    const userTime = new Date(
      nowUtc.toLocaleString('en-US', { timeZone: user.timeZone }),
    );

    //TODO: логика выбора заданий
    if (userTime.getHours() === 7) {
      const userChecklist = await this.prisma.checklist.findUnique({
        where: { userId: user.id },
        include: { tasks: true },
      });

      const newTasks = [] as Task[];

      const userRooms = user.rooms;
      const userArea = user.homeArea;
      const userProfession = user.profession;
      const userPetsNumber = user.pets;
      const userHasChildren = user.hasChildren;

      userRooms.forEach(async (room) => {
        const thisRoomTypeTasks = tasks.filter(
          (task) => task.room === room.type,
        );

        await this.prisma.room.update({
          where: { id: room.id },
          data: {
            tasksStory: thisRoomTypeTasks.map((task) => task.id),
          },
        });

        await this.prisma.checklist.update({
          where: { userId: user.id },
          data: {
            tasks: {},
          },
        });

        if (user.hasChildren) {
        }
      });
    }
  }

  async findById(id: number) {
    return await this.prisma.checklist.findUnique({
      where: { id: id },
      include: {
        tasks: true,
      },
    });
  }

  async completeChecklist(userId: number) {
    await this.usersService.updateUserOnChecklistCompleted(userId);
  }
}
