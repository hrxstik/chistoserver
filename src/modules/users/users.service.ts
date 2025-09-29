import { Injectable } from '@nestjs/common';
import { UpdateUserSettingsDto } from 'src/dto/update-user-settings.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async findById(id: number) {
    await this.usersRepository.findById(id);
  }

  async updateSettings(userId: number, updateDto: UpdateUserSettingsDto) {
    return this.usersRepository.update(userId, updateDto);
  }
}
