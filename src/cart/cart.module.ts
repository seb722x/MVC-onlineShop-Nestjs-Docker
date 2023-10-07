import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/models/order.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [CartController],
  providers:[CartService],
  imports:[AuthModule,ProductsModule,TypeOrmModule.forFeature([Order])],
  exports: [
    
    TypeOrmModule,
  ]
})
export class CartModule {}
