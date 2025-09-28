import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChecklistsModule } from './checklists/checklists.module';

@Module({
  imports: [AuthModule, UsersModule, ChecklistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
