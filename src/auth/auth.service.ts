import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDTO, SignInDTO } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: SignUpDTO) {
    const data = dto;
    try {
      const user = await this.prisma.user.create({
        data,
        select: { email: true, username: true, id: true },
      });
      throw new HttpException(
        {
          statusCode: 201,
          message: 'You have successfully created your account',
          data: user,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Email/Username provided is already taken.',
        );
      } else {
        throw error;
      }
    }
  }
  async signin(dto: SignInDTO) {
    const userFound = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (!userFound) {
      throw new NotFoundException(
        `Your credential does not match with any record`,
      );
    }
    const decrpyt: Promise<boolean> = argon.verify(
      userFound.password,
      dto.password,
    );
    if (!decrpyt) throw new NotAcceptableException('Password mis-matches');
    const token = this.signToken({
      id: userFound.id,
      email: userFound.email,
      username: userFound.username,
    });
    throw new HttpException(
      {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Login successfully',
        data: {
          token,
        },
      },
      HttpStatus.ACCEPTED,
    );
  }

  signToken(payload: { id: string; email: string | null; username: string }) {
    const secret = this.config.get('JWT_SECRET');
    const token: string = this.jwt.sign(payload, { secret });
    return token;
  }
}
