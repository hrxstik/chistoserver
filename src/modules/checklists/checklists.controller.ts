import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CompleteChecklistDto } from 'src/dto/complete-checklist.dto';
import { ChecklistsService } from './checklists.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';

@UseGuards(FirebaseAuthGuard, JwtAuthGuard)
@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @Post('complete')
  async completeChecklist(@Body() completeDto: CompleteChecklistDto) {
    const checklist = await this.checklistsService.findById(
      completeDto.findById,
    );

    if (checklist) {
      for (const task of checklist.tasks) {
        if (!task.isCompleted) return;
      }
    }

    const userId = checklist?.userId || 0;
    return this.checklistsService.completeChecklist(userId);
  }
}
