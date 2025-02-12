// jwt/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../db';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tu_super_secreto_seguro', // Mismo secreto que en el módulo
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.users.findUnique({
      where: { userid: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
