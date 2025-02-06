// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  // Generate JWT token with expiration time
  generateToken(userId: number, email: string): string {
    const payload = { userId, email };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',  // Set expiration time (e.g., 1 hour)
    });
  }
}
