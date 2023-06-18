import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewTaskDTO } from './dto';
import { UpdateTaskDTO } from './dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post('new')
  newTask(@Request() req, @Body() dto: NewTaskDTO) {
    const user = req.user;
    return this.taskService.saveTask(dto, user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  allTasks(@Request() req) {
    const user = req.user;
    return this.taskService.allTasks(user);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('edit/:task_id')
  updateTask(
    @Param() task: UpdateTaskDTO,
    @Body() dto: NewTaskDTO,
    @Request() req,
  ) {
    const user = req.user;
    const task_id: string = task.task_id;
    return this.taskService.editTask(task_id, dto, user);
  }
}
