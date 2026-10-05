import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateProductReqDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _repository: Repository<Product>,
  ) { }

  // Создание продукта
  async create(dto: CreateProductReqDto): Promise<Product> {
    const product = this._repository.create({
      title: dto.title,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      is_show: dto.is_show,
      category_id: dto.category_id,
    });

    return this._repository.save(product);
  }

  // Получение всех продуктов
  async getAll(): Promise<Product[]> {
    return this._repository.find();
  }

  // Получение одного продукта
  async getById(id: number): Promise<Product> {
    const product = await this._repository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(
        `Product with id ${id} not found`,
      );
    }

    return product;
  }

  // Полное обновление через PUT
  async update(
    id: number,
    dto: CreateProductReqDto,
  ): Promise<Product> {
    const product = await this.getById(id);

    this._repository.merge(product, dto);

    return this._repository.save(product);
  }

  // Частичное обновление через PATCH
  async patch(
    id: number,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getById(id);

    this._repository.merge(product, dto);

    return this._repository.save(product);
  }

  // Удаление
  async delete(id: number): Promise<void> {
    const product = await this.getById(id);

    await this._repository.remove(product);
  }
}