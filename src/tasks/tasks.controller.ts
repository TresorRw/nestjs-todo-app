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
import { ChangeStatusDTO, TaskDTO } from './dto';
import { TaskParamDTO } from './dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('Tasks management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post('new')
  @ApiCreatedResponse({
    type: TaskDTO,
    description: 'Your task has been created',
  })
  newTask(@Request() req, @Body() dto: TaskDTO) {
    return this.taskService.saveTask(dto, req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  @ApiOkResponse({
    status: 200,
    description: 'All tasks saved in your account',
  })
  allTasks(@Request() req) {
    return this.taskService.allTasks(req.user);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('edit/:task_id')
  @ApiParam({
    name: 'task_id',
    type: 'string',
    description: 'id of task to be updated',
  })
  @ApiAcceptedResponse({
    status: 202,
    description: 'Task updated successfully',
  })
  updateTask(
    @Param() task: TaskParamDTO,
    @Body() dto: TaskDTO,
    @Request() req,
  ) {
    return this.taskService.editTask(task.task_id, dto, req.user);
  }
  @ApiParam({
    name: 'task_id',
    type: 'string',
    description: 'id of task to be deleted',
  })
  @Delete('delete/:task_id')
  deleteTask(@Param() task: TaskParamDTO, @Request() req) {
    return this.taskService.deleteTask(task.task_id, req.user);
  }

  @ApiParam({
    name: 'task_id',
    type: 'string',
    description: 'id of task to be returned',
  })
  @Get(':task_id')
  singleTask(@Param() task: TaskParamDTO, @Request() req) {
    return this.taskService.singleTask(task.task_id, req.user);
  }

  @Patch('change-status/:task_id')
  @ApiParam({
    name: 'task_id',
    type: 'string',
    description: 'id of task to be updated',
  })
  changeStatus(
    @Param('task_id') task_id: string,
    @Request() req,
    @Body() dto: ChangeStatusDTO,
  ) {
    return { task_id, dto };
    // return this.taskService.statusChange(task.task_id, req.user);
  }
}
