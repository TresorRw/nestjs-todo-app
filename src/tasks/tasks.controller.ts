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
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiCreatedResponse({ description: 'Your task has been created' })
  newTask(@Request() req, @Body() dto: TaskDTO) {
    return this.taskService.saveTask(dto, req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  @ApiOkResponse({ description: 'All tasks saved in your account' })
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
  @ApiNotFoundResponse({ description: 'Not task found' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiAcceptedResponse({ description: 'Task updated successfully' })
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
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Not task found' })
  @ApiAcceptedResponse({ description: 'Task deleted successfully' })
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
  @ApiOkResponse({ description: 'Task returned' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  singleTask(@Param() task: TaskParamDTO, @Request() req) {
    return this.taskService.singleTask(task.task_id, req.user);
  }

  @Patch('change-status/:task_id')
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({
    name: 'task_id',
    type: 'string',
    description: 'id of task to be updated with status',
  })
  changeStatus(@Param('task_id') task_id: string, @Request() req) {
    return this.taskService.statusChange(task_id, req.user);
  }
}
