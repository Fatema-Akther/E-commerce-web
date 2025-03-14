import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { ChatModule } from './chat/chat.module';



@Module({
  imports: [CustomerModule, ProductModule,CartModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
