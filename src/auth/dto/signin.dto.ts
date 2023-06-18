import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, IsNotEmpty } from 'class-validator';
export class SignInDTO {
  @ApiProperty({ description: 'Your desired username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Your desired strong password' })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
