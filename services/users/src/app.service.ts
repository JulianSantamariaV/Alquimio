import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from './db';
import { JwtService } from './jwt/jwt.service';


@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    // Step 1: Find user by email
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Step 2: Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Step 3: Generate JWT token with expiration
    const accessToken = this.jwtService.generateToken(user.userid, user.email);
    return { accessToken };
  }

  getHello(): string {
    return 'Hello World2!';
  }
}