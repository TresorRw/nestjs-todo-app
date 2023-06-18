import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const checkTask = await this.prisma.task.findFirst({
      where: { id: task_id, userId: user.id },
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
    try {
      //Update the task
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
}
