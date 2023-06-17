import { Injectable } from '@nestjs/common';
import { NewTaskDTO } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class TasksService {
  saveTask(data: NewTaskDTO, user: User) {
    return { data, user };
  }
}
