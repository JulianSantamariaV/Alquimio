import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { TokenSchema } from './auth.types';
import { getPrismaService } from 'src/db/db';

export async function generateToken(
  userId: number,
  email: string,
  rol: number,
  refreshToken: string | undefined | null,
  prisma: PrismaClient,
) {
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
  const prisma = getPrismaService();
  try {
    const decodedToken: TokenSchema = jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const isTokenExpired = dayjs().isAfter(decodedToken.expiresAt);
    const user = await prisma.users.findUnique({
      where: { userid: decodedToken.userId },
    });
    if (!decodedToken.expiresAt) {
      return false;
    }
    const decodedRefreshToken = user?.refresh_token
      ? decodeToken(user?.refresh_token)
      : undefined;
    const isRefreshTokenExpired = decodedRefreshToken
      ? dayjs().isAfter(decodedRefreshToken.expiresAt)
      : undefined;

    if (isTokenExpired) {
      if (isRefreshTokenExpired || isRefreshTokenExpired === undefined) {
        return false;
      } else if (isRefreshTokenExpired === false) {
        const newAccessToken = jwtService.sign(
          {
            userId: decodedToken.userId,
            email: decodedToken.email,
            rol: decodedToken.rol,
            expiresAt: dayjs().add(15, 'minutes').toISOString(),
          },
          { secret: process.env.JWT_SECRET },
        );
        return newAccessToken;
      }
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function decodeToken(token: string) {
  const jwtService = new JwtService();
  const decodedToken: TokenSchema = jwtService.decode(token);
  return decodedToken;
}
