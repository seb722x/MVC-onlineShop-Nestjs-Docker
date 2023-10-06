import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [CartController],
  imports:[AuthModule]
})
export class CartModule {}
