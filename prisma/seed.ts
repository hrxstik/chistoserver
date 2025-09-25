import { PrismaClient, Achievement, Task } from '@prisma/client';
import { achievements, tasks } from './constants';

const prisma = new PrismaClient();

async function main() {
  await prisma.achievement.deleteMany({});
  await prisma.task.deleteMany({});

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: {
        id: achievement.id,
        name: achievement.name,
        levels: achievement.levels,
        type: achievement.type,
        values: achievement.values,
      },
    });
  }

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        id: task.id,
        description: task.description,
        type: task.type,
        room: task.room,
        reward: task.reward,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
