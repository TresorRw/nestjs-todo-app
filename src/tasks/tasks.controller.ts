import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewTaskDTO } from './dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post('new')
  newTask(@Request() req, @Body() dto: NewTaskDTO) {
    const user = req.user;
    return this.taskService.saveTask(dto, user);
  }

  @Get('all')
  allTasks() {
    return { msg: 'All tasks' };
  }
}
