import {
  Body,
  Controller,
  Delete,
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
import { TaskDTO } from './dto';
import { TaskParamDTO } from './dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post('new')
  newTask(@Request() req, @Body() dto: TaskDTO) {
    return this.taskService.saveTask(dto, req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  allTasks(@Request() req) {
    return this.taskService.allTasks(req.user);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('edit/:task_id')
  updateTask(
    @Param() task: TaskParamDTO,
    @Body() dto: TaskDTO,
    @Request() req,
  ) {
    return this.taskService.editTask(task.task_id, dto, req.user);
  }

  @Delete('delete/:task_id')
  deleteTask(@Param() task: TaskParamDTO, @Request() req) {
    return this.taskService.deleteTask(task.task_id, req.user);
  }

  @Get(':task_id')
  singleTask(@Param() task: TaskParamDTO, @Request() req) {
    return this.taskService.singleTask(task.task_id, req.user);
  }
}
