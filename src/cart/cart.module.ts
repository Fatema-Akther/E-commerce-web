// cart.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { Product } from 'src/product/product.entity';
import { registration } from 'src/customer/registration entity';
import { CartService } from './cart.service';



@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, registration])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
