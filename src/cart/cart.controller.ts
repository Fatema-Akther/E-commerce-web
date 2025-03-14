// cart.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  async addToCart(@Body('productId') productId: number, @Body('quantity') quantity: number, @Req() req: any) {
    const userId = req.user.id; // Extract user ID from the decoded token
    return await this.cartService.addToCart(userId, productId, quantity);
  }

  @Get('/my')
  async getMyCart(@Req() req: any) {
    const userId = req.user.id; // Extract user ID from the decoded token
    return await this.cartService.getCartByUser(userId);
  }

  @Delete('/remove/:productId')
  async removeFromCart(@Param('productId') productId: number, @Req() req: any) {
    const userId = req.user.id; // Extract user ID from the decoded token
    return await this.cartService.removeFromCart(userId, productId);
  }
}
