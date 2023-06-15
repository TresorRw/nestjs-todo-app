import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private config: ConfigService, private jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromHeaders(request);
    if (!token)
      throw new UnauthorizedException('You need to login to continue');
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(
        'Could not verify your session, please login again',
      );
    }
    return true;
  }

  private getTokenFromHeaders(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader) {
      const [type, token] = authorizationHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
