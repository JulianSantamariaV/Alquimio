import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './db';
import { JwtService } from './jwt/jwt.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule as NestJwtModule } from '@nestjs/jwt'; // Cambia este import

@Module({
  exports: [PrismaService],
  imports: [
    NestJwtModule.register({
      secret: 'tu_clave_secreta', // Mejor usar variables de entorno
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService, JwtStrategy],
})
export class AppModule {}
