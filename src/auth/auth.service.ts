import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../db/db';
import { generateToken } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
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
      const accessToken = await generateToken(
        user.userid,
        user.email,
        user.rol ?? 0,
        user.refresh_token,
        this.prisma
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
    lastname: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    // Input validation
    if (!username || !password || !name || !lastname || !email) {
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
          lastname,
          email,
          rol: 0, // Default role user, admin 1?
        },
      });

      // Generate JWT token
      const accessToken = await generateToken(
        newUser.userid,
        newUser.email,
        newUser.rol,
        newUser.refresh_token,
        this.prisma
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
      console.error(error);
      throw new Error('Failed to register user');
    }
  }
}
