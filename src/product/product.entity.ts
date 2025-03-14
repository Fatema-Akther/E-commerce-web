import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  productname: string;

  @Column({ length: 500 })
  category: string;

  @Column('int', { default: 0 })
  price: number;

  @Column('int', { default: 0 })
  rating: number;

  @Column({ type: 'boolean', default: true })
  availability: boolean;

  @Column({ nullable: true }) // Store image URL or file path
  image: string;
}
