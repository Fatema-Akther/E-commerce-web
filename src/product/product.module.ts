import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { registration } from 'src/customer/registration entity';
import { Cart } from 'src/cart/cart.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';





@Module({
  imports: [TypeOrmModule.forFeature([Product,registration,Cart])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
