import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { ProductService } from './product.service.js';
import { Product } from './entities/product.entity.js';

import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateProductReqDto } from './dto/create-product.dto.js';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Get('/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productService.getById(id);
  }
  //
  @Post()
  create(
    @Body() dto: CreateProductReqDto,
  ): Promise<Product> {
    return this.productService.create(dto);
  }
  //
  @Put('/:id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductReqDto,
  ): Promise<Product> {
    return this.productService.update(id, dto);
  }
  //
  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.patch(id, dto);
  }
  //
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.productService.delete(id);
  }
}