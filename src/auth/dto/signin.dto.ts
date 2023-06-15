import { IsString, IsStrongPassword, IsNotEmpty } from 'class-validator';
export class SignInDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
