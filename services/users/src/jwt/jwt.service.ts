// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  // Generate JWT token with expiration time
  generateToken(userId: number, email: string, rol: number): string {
    const payload = { userId, email, rol };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',  // Set expiration time (e.g., 1 hour)
    });
  }
}
