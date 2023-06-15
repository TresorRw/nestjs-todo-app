import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';
import * as argon from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDTO) {
    const password = await argon.hash(dto.password);
    return this.authService.signup({ ...dto, password });
  }

  @Post('signin')
  signin(@Body() dto: SignInDTO) {
    return this.authService.signin(dto);
  }
}
