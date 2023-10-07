import { Module } from '@nestjs/common';
import { AdminProductsController } from '../products/admin.products.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/product.entity';

@Module({
  controllers: [ ProductsController,AdminProductsController],
  providers:[ProductsService],
  imports:[AuthModule,TypeOrmModule.forFeature([Product])],
  exports: [
    ProductsService,
    TypeOrmModule,
  ]
})
export class ProductsModule {}
