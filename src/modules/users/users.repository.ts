import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: any) {
    const { rooms, roommates, ...userData } = data;

    return this.prisma.user.create({
      data: {
        ...userData,
        rooms: {
          create: rooms?.map((room) => ({
            type: room.type,
            tasksStory: [],
          })),
        },
        hasChildren: roommates?.some((roommate) => roommate.age < 12) || false,
        roommates: roommates ? JSON.stringify(roommates) : null,
      },
      include: {
        rooms: true,
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
