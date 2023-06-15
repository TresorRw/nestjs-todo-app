import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get('')
  home(@Request() req) {
    return { user: req.user };
  }
}
