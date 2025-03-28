import { JwtService } from '@nestjs/jwt';

import dayjs from 'dayjs';
import { TokenSchema } from './auth.types';

export async function generateTokens(
  userId: number,
  email: string,
  rol: number,
  name: string,
  username: string,
) {
  const jwtService = new JwtService();
  const payload = {
    userId, // subject (standard JWT claim)
    email: email,
    rol: rol,
    name,
    username,
  };

  const newRefreshToken = jwtService.sign(
    { ...payload, expiresAt: dayjs().add(30, 'days').toISOString() },
    { secret: process.env.JWT_SECRET },
  );
  const newAccessToken = jwtService.sign(
    { ...payload, expiresAt: dayjs().add(15, 'minutes').toISOString() },
    { secret: process.env.JWT_SECRET },
  );

  return { newAccessToken, newRefreshToken };
}

export function decodeToken(token: string) {
  const jwtService = new JwtService();
  const decodedToken: TokenSchema = jwtService.decode(token);
  return decodedToken;
}
export function verifyToken(token: string) {
  const jwtService = new JwtService();
  try {
    const decodedToken: TokenSchema = jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    return decodedToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}
