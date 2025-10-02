import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, UserAchievement, AchievementType } from '@prisma/client';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
    });
  }

  async updateUserAchievements(
    userId: number,
    updatedFields: {
      streak?: number;
      chubriksGrown?: number;
      chubrikPhaseReached?: number;
      chubriksGone?: number;
    },
  ) {
    const achievements = await this.prisma.achievement.findMany();
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
    });

    for (const achievement of achievements) {
      let userAch = userAchievements.find(
        (ua) => ua.achievementId === achievement.id,
      );

      let userValue = 0;
      switch (achievement.type) {
        case AchievementType.STREAK:
          userValue = updatedFields.streak ?? 0;
          break;
        case AchievementType.CHUBRIKS_GROWN:
          userValue = updatedFields.chubriksGrown ?? 0;
          break;
        case AchievementType.CHUBRIK_PHASE_REACHED:
          userValue = updatedFields.chubrikPhaseReached ?? 0;
          break;
        case AchievementType.CHUBRIKS_GONE:
          userValue = updatedFields.chubriksGone ?? 0;
          break;
      }

      let newLevel = 0;
      for (let i = 0; i < achievement.values.length; i++) {
        if (userValue >= achievement.values[i]) {
          newLevel = achievement.levels[i];
        }
      }

      if (!userAch) {
        if (newLevel > 0) {
          await this.prisma.userAchievement.create({
            data: {
              userId,
              achievementId: achievement.id,
              currentLevel: newLevel,
            },
          });
        }
      } else {
        if (newLevel > userAch.currentLevel) {
          await this.prisma.userAchievement.update({
            where: { id: userAch.id },
            data: { currentLevel: newLevel },
          });
        }
      }
    }
  }
}
