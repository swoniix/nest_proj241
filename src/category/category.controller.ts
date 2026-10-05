import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdir } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { CategoryService } from './category.service.js';
import { CategoryCreateReqDto } from './dtos/category_create.req.dto.js';
import { CategoryGetResDto } from './dtos/category_get.res.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';

const categoryImageDirectory = join(process.cwd(), 'uploads', 'categories');
const imageExtensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // @Get()
  // getAllCategories(): CategoryGetResDto[] {
  //   return this.categoryService.getCategories();
  // }

  // @Get(':id')
  // getCategoryById(@Param('id') id: string): CategoryGetResDto {
  //   const category: CategoryGetResDto | undefined =
  //     this.categoryService.getCategoryById(+id);
  //   if (category === undefined) {
  //     throw new NotFoundException('Category not found');
  //   }
  //   return category;
  // }

  // @Roles('admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          mkdir(categoryImageDirectory, { recursive: true }, (error) => {
            callback(error, categoryImageDirectory);
          });
        },
        filename: (_request, file, callback) => {
          const extension = imageExtensions[file.mimetype];
          if (!extension) {
            callback(new BadRequestException('Unsupported image type'), '');
            return;
          }
          callback(null, `${randomUUID()}${extension}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        if (!imageExtensions[file.mimetype]) {
          callback(
            new BadRequestException(
              'Only JPEG, PNG, GIF and WebP images are allowed',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    }),
  )
  async createCategory(
    @Body(new ValidationPipe({ transform: true }))
    category: CategoryCreateReqDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<CategoryGetResDto> {
    if (image) {
      category.image = `/uploads/categories/${image.filename}`;
    }
    const created = await this.categoryService.create(category);
    return created;
  }
  @Public()
  @Get()
  async getAllCategory(): Promise<CategoryGetResDto[]> {
    return await this.categoryService.findAll();
  }

  // @Get(':id')
  // async getCategoryById(@Param('id') id: number): Promise<CategoryGetResDto> {
  //   const category = await this.categoryService.findById();
  // }
}
