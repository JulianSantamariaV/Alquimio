import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(userId: number, email: string, rol: number): string {
    const payload = { userId, email, rol };
    return this.jwtService.sign(payload);
  }
}