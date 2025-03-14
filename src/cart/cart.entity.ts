// cart.entity.ts

import { registration } from "src/customer/registration entity";
import { Product } from "src/product/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => registration, (user) => user.id, { eager: true })
  user: registration;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  product: Product;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('boolean', { default: true })
  isActive: boolean; // For marking whether the cart item is still active or checked out
}
