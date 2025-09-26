import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
