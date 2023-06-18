import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsStrongPassword,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';
export class SignUpDTO {
  @ApiProperty({ description: 'Username', required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;

  @ApiProperty({ description: 'Strong password', required: true })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ description: 'Your email', required: false })
  @IsOptional()
  @IsEmail()
  email: string;
}
