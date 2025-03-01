import { Module } from '@nestjs/common';
import { AppController } from './auth.controller';
import { AppService } from './auth.service';
import { PrismaService } from '../db/db';
import { JwtService } from '../jwt/jwt.service';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtModule as NestJwtModule } from '@nestjs/jwt'; // Cambia este import
import { ProductsModule } from '../products/products.module';

@Module({
  exports: [PrismaService],
  imports: [
    NestJwtModule.register({
      secret: 'tu_clave_secreta', // Mejor usar variables de entorno
      signOptions: { expiresIn: '7d' },
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService, JwtStrategy],
})
export class AuthModule {}
