import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../db/db';
import { ProductsModule } from 'src/products/src/products.module';


@Module({
  exports: [PrismaService],
  imports: [
    ProductsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
