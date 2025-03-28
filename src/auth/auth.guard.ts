import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyToken } from './utils';
import dayjs from 'dayjs';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const now = dayjs();
      // verificar si el token es válido
      const payload = verifyToken(token);
      // verificar q no este expirado
      if (payload?.expiresAt) {
        if (dayjs(payload.expiresAt).isBefore(now)) {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
