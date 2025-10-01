import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}
  async findByUserId(id: number) {
    return await this.prisma.achievement.findUnique({
      where: {},
    });
  }

  async update(id: number) {
    return await this.prisma.checklist.update({
      where: { userId: id },
      data: le,
    });
  }
}
