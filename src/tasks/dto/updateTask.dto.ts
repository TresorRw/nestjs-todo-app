import { IsString, IsUUID } from 'class-validator';

export class UpdateTaskDTO {
  @IsString()
  @IsUUID()
  task_id: string;
}
