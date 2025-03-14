// cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/product/product.entity';
import { registration } from 'src/customer/registration entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Add product to cart
  async addToCart(userId: number, productId: number, quantity: number = 1) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if the cart entry for this product and user already exists
    let cartItem = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId }, isActive: true },
    });

    if (cartItem) {
      // Update the quantity
      cartItem.quantity += quantity;
    } else {
      // Create a new cart item
      cartItem = this.cartRepository.create({
        user: { id: userId },
        product,
        quantity,
      });
    }

    return await this.cartRepository.save(cartItem);
  }

  async getCartByUser(userId: number) {
    const carts = await this.cartRepository.find({
        where: { user: { id: userId }, isActive: true },
        relations: ['product'], // Only fetch product details
    });

    // Remove the user field manually before returning the response
    return carts.map(({ user, id, ...cart }) => cart);
}





  // delete product from cart
  async removeFromCart(userId: number, productId: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId }, isActive: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.isActive = false; // Mark as inactive instead of deleting
    return await this.cartRepository.save(cartItem);
  }
}
