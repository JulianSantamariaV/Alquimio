import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { TokenSchema } from './auth.types';


export async function generateToken(
  userId: number,
  email: string,
  rol: number,
  refreshToken: string | undefined | null,
) {
  const prisma = new PrismaClient();
  const jwtService = new JwtService();
  const now = dayjs();
  const payload = {
    userId, // subject (standard JWT claim)
    email: email,
    rol: rol,
  };

  const decodedToken = refreshToken ? decodeToken(refreshToken) : undefined;
  const isRefreshTokenExpired = decodedToken
    ? now.isAfter(decodedToken?.expiresAt)
    : undefined;
  const newRefreshToken = jwtService.sign(
    { ...payload, expiresAt: dayjs().add(30, 'days').toISOString() },
    { secret: process.env.JWT_SECRET },
  );
  const newAccessToken = jwtService.sign(
    { ...payload, expiresAt: dayjs().add(15, 'minutes').toISOString() },
    { secret: process.env.JWT_SECRET },
  );
  if (!refreshToken || isRefreshTokenExpired) {
    await prisma.users.update({
      where: { userid: userId },
      data: { refresh_token: newRefreshToken },
    });
    return newAccessToken;
  }

  return newAccessToken;
}
export async function verifyAccessToken(token: string) {
  const jwtService = new JwtService();
  const decodedToken = decodeToken(token);
  const isTokenExpired = dayjs().isAfter(decodedToken.expiresAt);
  if (isTokenExpired) {
    return null;
  }
  try {
    return jwtService.verify(token, { secret: process.env.JWT_SECRET });
  } catch (error) {
    console.error('error verifying token', error);

    return null;
  }
}

export function decodeToken(token: string) {
  const jwtService = new JwtService();
  const decodedToken: TokenSchema = jwtService.decode(token);
  return decodedToken;
}
