import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  cartRepository: any;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addProduct(productData: Partial<Product>, imagePath?: string) {
    const product = this.productRepository.create({ ...productData, image: imagePath });
    return await this.productRepository.save(product);
  }


      // Get all product details
      async getAllProducts(): Promise<Product[]> {
        return await this.productRepository.find(); // Fetch all products
      }


      //search product
      async searchAndFilter(filter:  {
        name?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: 'asc' | 'desc' 
    }) {
        const query = this.productRepository.createQueryBuilder('product');

        if (filter.name) {
            query.andWhere('product.productname LIKE :name', { name: `%${filter.name}%` });
        }

        if (filter.category) {
            query.andWhere('product.category LIKE :category', { category: `%${filter.category}%` });
        }

        if (filter.minPrice) {
            query.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
        }

        if (filter.maxPrice) {
            query.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
        }

        // Sorting by price
  if (filter.sortBy) {
    query.orderBy('product.price', filter.sortBy.toUpperCase() as 'ASC' | 'DESC');
  }

        return await query.getMany();
    }

      

    async updateProduct(id: number, updateData: Partial<Product>, imagePath?: string) {
      const product = await this.productRepository.findOne({ where: { id } });
    
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
    
      if (imagePath) {
        updateData.image = imagePath; // Update the image if a new one is uploaded
      }
    
      await this.productRepository.update(id, updateData);
      return this.productRepository.findOne({ where: { id } }); // Return the updated product
    }
    
  
     
}

    
    
