import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity.js';
import { Repository } from 'typeorm';
import { CategoryCreateReqDto } from './dtos/category_create.req.dto.js';
import { CategoryGetResDto } from './dtos/category_get.res.dto.js';

@Injectable()
export class CategoryService {
  getCategories(): CategoryGetResDto[] {
    throw new Error('Method not implemented.');
  }
  getCategoryById(arg0: number): CategoryGetResDto | undefined {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Category)
    private readonly _repository: Repository<Category>,
  ) {}

  async create(dto: CategoryCreateReqDto): Promise<CategoryGetResDto> {
    const category = this._repository.create({
      title: dto.title,
      slug: dto.slug,
      image: dto.image,
      is_show: true,
      parent_id: dto.parent_id,
      description: dto.description,
    });
    const result = await this._repository.save(category);
    return {
      id: result.id,
      title: result.title,
      slug: result.slug,
      image: result.image ?? '',
      parent_id: result.parent_id,
    };
  }

  async findAll(): Promise<CategoryGetResDto[]> {
    const categories = await this._repository.find();
    const result: CategoryGetResDto[] = [];
    categories.forEach((c: Category) => {
      result.push({
        id: c.id,
        title: c.title,
        slug: c.slug,
        image: c.image ?? '',
        parent_id: c.parent_id,
      });
    });
    return result;
  }

  async findById(id: number): Promise<CategoryGetResDto | undefined> {
    const category = await this._repository.findOneBy({ id });
    if (category) {
      const result: CategoryGetResDto = {
        id: category.id,
        title: category.title,
        slug: category.slug,
        image: category.image ?? '',
        parent_id: category.parent_id,
      };
      return result;
    }
  }
}
