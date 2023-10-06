import { Module } from '@nestjs/common';
import { AdminProductsController } from '../products/admin.products.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ AdminProductsController],
  imports:[AuthModule]
})
export class ProductsModule {}
