import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products/products.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductsService } from './products/products.service';
import { User } from './models/user.entity';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { CartModule } from './cart/cart.module';
import { Item } from './models/item.entity';
import { Order } from './models/order.entity';
import { CartService } from './cart/cart.service';
import { ProductsModule } from './products/products.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, User, Item, Order]),
    
    AuthModule,
    CartModule,
    ProductsModule
    
  ],
  controllers: [AppController ],
 
})
export class AppModule {}
