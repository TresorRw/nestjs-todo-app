import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { TaskDTO } from './dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async saveTask(data: TaskDTO, user: User) {
    try {
      const save = await this.prisma.task.create({
        data: { ...data, userId: user.id },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Your task has been created successfully',
        task_details: save,
      };
    } catch (error) {
      throw new Error('Task creation failed');
    }
  }

  async allTasks(user: User) {
    const tasks = await this.prisma.task.findMany({
      where: { userId: user.id },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'All saved tasks in your account',
      tasks,
    };
  }

  async editTask(task_id: string, taskDetails: TaskDTO, user: User) {
    try {
      await this.checkOwnership(task_id, user.id);
    } catch (error) {
      return this.errorReturner(error);
    }
    try {
      const updateTask = await this.prisma.task.update({
        where: { id: task_id },
        data: {
          title: taskDetails.title,
          description: taskDetails.description,
          dateTime: taskDetails.dateTime,
        },
      });
      return {
        statusCode: HttpStatus.ACCEPTED,
        message: `${updateTask.title} is updated successfully`,
        new_details: updateTask,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_MODIFIED,
          message: 'Task updation failed',
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async deleteTask(task_id: string, user: User) {
    try {
      const task = await this.checkOwnership(task_id, user.id);
      const del = await this.prisma.task.delete({ where: { id: task.id } });
      if (del) {
        throw new HttpException(
          {
            statuCode: HttpStatus.ACCEPTED,
            message: `${del.title} Task is deleted successfully`,
          },
          HttpStatus.ACCEPTED,
        );
      }
    } catch (error) {
      return this.errorReturner(error);
    }
  }

  async singleTask(task_id: string, user: User) {
    const response = await this.prisma.task.findFirst({
      where: { id: task_id, userId: user.id },
    });
    return { message: `Task with ${task_id}`, task: response };
  }

  async statusChange(task_id: string, user: User) {
    try {
      const checkTask = await this.checkOwnership(task_id, user.id);
      const update = await this.prisma.task.update({
        where: { id: task_id },
        data: { isCompleted: !checkTask.isCompleted },
      });
      return {
        statusCode: HttpStatus.OK,
        message: `${update.title} is now marked as ${
          update.isCompleted ? 'completed ✅' : 'not completed ❌'
        }`,
      };
    } catch (error) {
      return this.errorReturner(error);
    }
  }

  private async checkOwnership(task_id: string, user_id: string) {
    const checkTask = await this.prisma.task.findFirst({
      where: { id: task_id, userId: user_id },
    });
    if (!checkTask) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'We can not find matching task in your account',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return checkTask;
  }

  private errorReturner(error: any) {
    if (error instanceof HttpException) {
      throw new HttpException(
        {
          statusCode: error.getStatus(),
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    throw new BadRequestException(error.message);
  }
}
