import { Controller, Post, Body, UploadedFile, UseInterceptors, Get, Query, Delete, Param, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { extname } from 'path';

import { File as MulterFile } from 'multer';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Store images in 'uploads' folder
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async addProduct(@Body() data: Product, @UploadedFile() file: MulterFile) {
    const imagePath = file ? `/uploads/${file.filename}` : undefined;
 // Store file path
    return await this.productService.addProduct(data, imagePath);
  }


        @Get('/all')
      
        async getAllProducts() {
          return await this.productService.getAllProducts();
        }

       //search product
       @Get('/search')
       
       async searchAndFilter(
           @Query('name') name?: string,
           @Query('category') category?: string,
           @Query('minPrice') minPrice?: number,
           @Query('maxPrice') maxPrice?: number,
           @Query('sortBy') sortBy?: 'asc' | 'desc' // Add sorting query parameter
       ) {
           return await this.productService.searchAndFilter({ name, category, minPrice, maxPrice,sortBy  });
       }


       @Put('/update/:id')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async updateProduct(
  @Param('id') id: number,
  @Body() data: Partial<Product>,
  @UploadedFile() file?: MulterFile,
) {
  const imagePath = file ? `/uploads/${file.filename}` : undefined;
  return await this.productService.updateProduct(id, data, imagePath);
}
}

