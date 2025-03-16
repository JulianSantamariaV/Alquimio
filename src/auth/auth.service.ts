import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../db/db';
import { generateTokens, verifyToken } from './utils';
import { Response, Request } from 'express';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<{ accessToken: string; res: Response }> {
    console.log('🟡 Datos recibidos en el backend:', { email, password });
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
      const response = await generateTokens(
        user.userid,
        user.email,
        user.rol ?? 0,
        user.name,
        user.username,
      );

      const { newAccessToken, newRefreshToken } = response;

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true, // true en prod con la https
        sameSite: 'lax', //'strict', strict cuando sea prod
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });

      return { accessToken: newAccessToken, res };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(error);
      throw new Error('Login failed');
    }
  }
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    console.log('refresh token is', refreshToken);
    const decodedToken = verifyToken(refreshToken);
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const { userId, email, rol, expiresAt } = decodedToken;

    const isTokenExpired = dayjs().isAfter(expiresAt);
    if (isTokenExpired) {
      throw new UnauthorizedException('Refresh token expired');
    }
    try {
      const user = await this.prisma.users.findUnique({
        where: { userid: userId },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const response = await generateTokens(
        userId,
        email,
        rol,
        user.name,
        user.username,
      );
      const { newAccessToken, newRefreshToken } = response;

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true, // true en prod con la https
        sameSite: 'lax', //'strict', strict cuando sea prod
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });
      return { accessToken: newAccessToken, res };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error(error);
      throw new Error('refresh token failed');
    }
  }

  async register(
    username: string,
    password: string,
    name: string,
    lastname: string,
    email: string,
    res: Response,
  ): Promise<{ accessToken: string; res: Response }> {
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
      const response = await generateTokens(
        newUser.userid,
        newUser.email,
        newUser.rol,
        newUser.name,
        newUser.username,
      );
      const { newAccessToken, newRefreshToken } = response;

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true, // true en prod con la https
        sameSite: 'lax', //'strict', strict cuando sea prod
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      });

      return { accessToken: newAccessToken, res };
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
