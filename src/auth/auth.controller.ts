import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';
import * as argon from 'argon2';
import {
  ApiAcceptedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ description: 'Signup successful' })
  @ApiConflictResponse({ description: 'Email/username is already in taken' })
  async signup(@Body() dto: SignUpDTO) {
    const password = await argon.hash(dto.password);
    return this.authService.signup({ ...dto, password });
  }

  @Post('signin')
  @ApiAcceptedResponse({ description: 'Login successful' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiNotAcceptableResponse({ description: 'Wrong password' })
  signin(@Body() dto: SignInDTO) {
    return this.authService.signin(dto);
  }
}
