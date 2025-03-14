import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { registration } from './registration entity';
import { Product } from 'src/product/product.entity';
import { ChatMessage } from 'src/chat/chat.entity';
import { Cart } from 'src/cart/cart.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TokenMiddleware } from './middleware';




@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'firfas524',
        database: 'customer4',
        entities: [registration,Product,Cart,ChatMessage],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([registration,Product,Cart,ChatMessage]),
    ],
    controllers: [CustomerController],
    providers: [CustomerService],
  })
  export class CustomerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(TokenMiddleware).forRoutes( 'customer/update','customer/profile','product/all','product/search','cart/add','cart/my','cart/remove/:productId'); // Apply to all customer routes
    }
  }
  