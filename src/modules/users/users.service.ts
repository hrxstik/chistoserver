import { Injectable } from '@nestjs/common';
import { UpdateUserSettingsDto } from 'src/dto/update-user-settings.dto';
import { UsersRepository } from './users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
    private readonly achievementsService: AchievementsService,
  ) {}
  async findById(id: number) {
    await this.usersRepository.findById(id);
  }

  async updateSettings(userId: number, updateDto: UpdateUserSettingsDto) {
    return this.usersRepository.update(userId, updateDto);
  }

  async updateUsersChubrikAndChecklistState() {
    const nowUtc = new Date();
    const users = await this.prisma.user.findMany({
      include: { checklist: true },
    });

    if (users) {
      for (const user of users) {
        const userTime = new Date(
          nowUtc.toLocaleString('en-US', { timeZone: user.timeZone }),
        );

        if (userTime.getHours() === 7 && !user.checklist?.isCompleted) {
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              streak: 1,
              currentChubrikLevel: 1,
              chubriksGone: user.chubriksGone + 1,
            },
          });

          await this.achievementsService.updateUserAchievements(user.id, {
            streak: 1,
            chubriksGrown: user.chubriksGrown,
            chubrikPhaseReached: 1,
            chubriksGone: user.chubriksGone + 1,
          });

          await this.prisma.$transaction(async (tx) => {
            const checklist = await tx.checklist.findUnique({
              where: { userId: user.id },
            });
            if (checklist && !checklist.isCompleted) {
              await tx.checklist.update({
                where: { userId: user.id },
                data: { isCompleted: false },
              });
            }
          });
        }
      }
    }
  }
  async updateUserOnChecklistCompleted(userId: number) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.currentChubrikLevel === 28) {
      await this.usersRepository.update(userId, {
        currentChubrikLevel: 1,
        chubriksGrown: user.chubriksGrown + 1,
        streak: user.streak + 1,
      });
    } else {
      await this.usersRepository.update(userId, {
        currentChubrikLevel: user.currentChubrikLevel + 1,
        chubriksGrown: user.chubriksGrown,
        streak: user.streak + 1,
      });
    }
  }
}
