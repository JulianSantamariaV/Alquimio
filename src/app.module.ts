import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/src/products.module';
import { ServicesModule } from './services/src/services.module';



@Module({
  imports: [AuthModule, ProductsModule, ServicesModule],
})
export class AppModule {}
