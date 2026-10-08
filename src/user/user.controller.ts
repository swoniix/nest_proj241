import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserReqDto } from './dto/create-user.req.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UpdateDeliveryAddressDto } from './dto/update-delivery-address.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserReqDto) {
    return this.userService.create(createUserDto);
  }

  // Homework 30.09: GET-запит для отримання всіх користувачів
  @Get()
  findAll() {
    // Тут отримуємо список усіх користувачів
    return this.userService.findAll();
  }

  // Homework 30.09: GET-запит для отримання користувача за id
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Тут отримуємо одного користувача за його id
    return this.userService.findOne(+id);
  }

  // Homework 30.09: PATCH-запит для оновлення користувача
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // Тут оновлюємо тільки ті поля, які прийшли у запиті
    return this.userService.update(+id, updateUserDto);
  }

  @Put(':id/delivery-address')
  updateDeliveryAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateDeliveryAddressDto,
  ) {
    return this.userService.updateDeliveryAddress(+id, updateAddressDto);
  }

  // Homework 30.09: DELETE-запит для видалення користувача
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Тут видаляємо користувача за id
    return this.userService.remove(+id);
  }
}
