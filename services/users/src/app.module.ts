import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './db';
import { JwtService } from './jwt/jwt.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule } from './jwt/jwt.module';

@Module({
  exports:[PrismaService],
  imports:[JwtModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService, JwtStrategy],
})
export class AppModule {}
