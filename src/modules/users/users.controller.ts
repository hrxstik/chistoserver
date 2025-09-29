import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateUserSettingsDto } from 'src/dto/update-user-settings.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Put('settings')
  async updateSettings(@Req() req, @Body() updateDto: UpdateUserSettingsDto) {
    return this.usersService.updateSettings(req.user.sub, updateDto);
  }
}
