// jwt/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(userId: number, email: string, rol: number): string {
    const payload = {
      sub: userId, // subject (standard JWT claim)
      email: email,
      rol: rol,
      iat: Date.now(), // issued at (standard JWT claim)
    };

    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      console.error('error verifying token', error);

      return null;
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
