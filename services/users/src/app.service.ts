import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from './db';
import { JwtService } from './jwt/jwt.service';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    // Input validation
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    try {
      // Find user by email
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const accessToken = this.jwtService.generateToken(
        user.userid,
        user.email,
        user.rol ?? 0,
      );

      return { accessToken };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Login failed');
    }
  }

  async register(
    username: string,
    password: string,
    name: string,
    lastName: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    // Input validation
    if (!username || !password || !name || !lastName || !email) {
      throw new BadRequestException('All fields are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    try {
      // Check if user already exists
      const existingUser = await this.prisma.users.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser.email === email
            ? 'Email already registered'
            : 'Username already taken',
        );
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = await this.prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          name,
          lastName,
          email,
          rol: 0, // Default role
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Generate JWT token
      const accessToken = this.jwtService.generateToken(
        newUser.userid,
        newUser.email,
        newUser.rol,
      );

      return { accessToken };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Log the error here if needed
      throw new Error('Failed to register user');
    }
  }
}
