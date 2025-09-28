import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChecklistsModule } from './modules/checklists/checklists.module';
import { ResendModule } from 'nestjs-resend';
import { VerificationCodeModule } from './modules/verification-code/verification-code.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChecklistsModule,
    ScheduleModule.forRoot(),
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API_KEY as string,
    }),
    VerificationCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
