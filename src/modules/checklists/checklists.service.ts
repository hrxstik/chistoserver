import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { PushNotificationsService } from '../notifications/push-notifications.service';
import { UsersService } from '../users/users.service';
import {
  Checklist,
  HomeArea,
  Prisma,
  Room,
  RoomType,
  Task,
  TaskType,
  User,
} from '@prisma/client';

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

  async createChecklist(
    user: UserWithRelations,
    nowUtc: Date,
    allTasks: Task[],
  ) {
    const userTime = new Date(
      nowUtc.toLocaleString('en-US', { timeZone: user.timeZone }),
    );

    if (userTime.getHours() !== 7) {
      return;
    }

    const currentChecklist = await this.prisma.checklist.findUnique({
      where: { userId: user.id },
      include: { tasks: { include: { task: true } } },
    });

    // Добавляем выполненные задачи в историю комнат (tasksStory в Room)
    if (currentChecklist && currentChecklist.tasks.length > 0) {
      for (const checklistTask of currentChecklist.tasks) {
        if (checklistTask.isCompleted) {
          const task = checklistTask.task;

          const room = user.rooms.find((r) => r.type === task.room);
          if (room) {
            const updatedStory = [...new Set([...room.tasksStory, task.id])]; // Добавляем уникально
            await this.prisma.room.update({
              where: { id: room.id },
              data: { tasksStory: updatedStory },
            });
          }
        }
      }
    }

    function baseTasksCountByAge(age: number): number {
      if (age < 21) return 2;
      else return 1;
    }

    function extraTasksByHomeArea(area: HomeArea): number {
      switch (area) {
        case 'TINY':
        case 'SMALL':
          return 2;
        case 'MEDIUM':
          return 1;
        case 'LARGE':
          return 0;
      }
    }

    // Определяем базовое количество заданий на комнату
    const baseCount = baseTasksCountByAge(user.age);
    const areaExtra = extraTasksByHomeArea(user.homeArea);

    const resultTasks: Task[] = [];

    // Пул заданий по комнатам от всех заданий
    const tasksByRoom = new Map<RoomType, Task[]>();
    for (const room of user.rooms) {
      tasksByRoom.set(
        room.type,
        allTasks.filter((t) => t.room === room.type),
      );
    }

    for (const room of user.rooms) {
      let taskCount = baseCount + areaExtra;

      // Профессия требования
      switch (user.profession) {
        case 'NONE':
          taskCount += 1;
          break;
        case 'STUDENT':
          if (room.type === 'OFFICE') taskCount += 1;
          else if (
            !user.rooms.some((r) => r.type === 'OFFICE') &&
            room.type === 'BEDROOM'
          )
            taskCount += 1;
          break;
        case 'OFFICE_WORKER':
          taskCount = Math.max(1, taskCount - 1);
          break;
        case 'REMOTE_WORKER':
          if (
            room.type === 'OFFICE' ||
            room.type === 'KITCHEN' ||
            room.type === 'BEDROOM'
          ) {
            taskCount += 1;
          }
          break;
        case 'HYBRID_WORKER':
          if (room.type === 'OFFICE') {
            taskCount += 1;
          }
          break;
        case 'STREET_WORKER':
          // Не зависят от комнаты, обработается отдельно
          break;
      }

      // Задания для сожителей (зависят только от количества)
      // TODO: Добавить зависимость от профессии
      const roommatesCount = Array.isArray(user.roommates)
        ? user.roommates.length
        : 0;
      taskCount += roommatesCount;

      // Выбираем задачи для комнаты в логичном порядке, не больше чем есть в пуле
      const availableTasks = tasksByRoom.get(room.type) || [];
      const selectedTasks = availableTasks.slice(0, taskCount);
      resultTasks.push(...selectedTasks);
    }

    // Обработка уличного работника: добавляет задания LAUNDRY (стирка и др.) с логикой очередности
    if (user.profession === 'STREET_WORKER') {
      // Последовательность стирка, снятие с сушки, глажка с ограничением порядка:
      const laundryTasksOrder = [32, 33, 34]; // id заданий laundry в правильном порядке
      const lastDayCompletedLaundryTaskId = user.rooms
        .flatMap((r) => r.tasksStory)
        .filter((id) => laundryTasksOrder.includes(id))
        .sort(
          (a, b) => laundryTasksOrder.indexOf(a) - laundryTasksOrder.indexOf(b),
        )
        .pop();

      let nextLaundryTaskId: number;
      if (!lastDayCompletedLaundryTaskId) {
        nextLaundryTaskId = 32; // сначала стирка
      } else {
        const idx = laundryTasksOrder.indexOf(lastDayCompletedLaundryTaskId);
        nextLaundryTaskId = laundryTasksOrder[idx + 1] || 32; // если дошли до конца, начать заново
      }
      const nextLaundryTask = allTasks.find((t) => t.id === nextLaundryTaskId);
      if (nextLaundryTask) {
        resultTasks.push(nextLaundryTask);
      }
    }

    // Добавляем "Убрать детские игрушки" если есть ребенок
    if (user.hasChildren) {
      const toyTask = allTasks.find((t) => t.id === 35); // id задания по игрушкам
      if (toyTask) {
        resultTasks.push(toyTask);
      }
    }

    // Пылесосим в зависимости от количества животных (каждый день если >1, иначе каждые 2 дня)
    const vacuumTasks = allTasks.filter((t) => t.type === TaskType.VACUUMING);
    if (user.pets > 1) {
      resultTasks.push(...vacuumTasks);
    } else if (user.pets === 1) {
      // каждые 2 дня - можно проверить, был ли вчера пылесос (упрощенно - возьмем половину из доступных)
      const halfVacuumTasks = vacuumTasks.slice(
        0,
        Math.ceil(vacuumTasks.length / 2),
      );
      resultTasks.push(...halfVacuumTasks);
    }

    const dailyTasks = allTasks.filter((t) => t.type === 'DAILY');
    resultTasks.push(...dailyTasks);

    // Убираем дубли по ID и лимитируем количество задач по комнате (если больше нету — берем что есть)
    const uniqueTasks = new Map<number, Task>();
    for (const task of resultTasks) {
      uniqueTasks.set(task.id, task);
    }

    // Создаем или обновляем чеклист с новыми задачами
    const newChecklistTasksData = Array.from(uniqueTasks.values()).map(
      (task) => ({
        taskId: task.id,
      }),
    );

    if (currentChecklist) {
      // Обновляем
      await this.prisma.checklist.update({
        where: { id: currentChecklist.id },
        data: {
          tasks: {
            deleteMany: {}, // очищаем старые задачи
            createMany: {
              data: newChecklistTasksData,
            },
          },
          isCompleted: false,
          updatedAt: new Date(),
        },
      });
    } else {
      // Создаем новый чеклист если нет
      await this.prisma.checklist.create({
        data: {
          userId: user.id,
          tasks: { createMany: { data: newChecklistTasksData } },
          isCompleted: false,
        },
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

  async findByUserId(id: number) {
    return await this.prisma.checklist.findUnique({
      where: { userId: id },
      include: { tasks: true },
    });
  }

  async completeChecklist(userId: number) {
    await this.usersService.updateUserOnChecklistCompleted(userId);
  }
}
