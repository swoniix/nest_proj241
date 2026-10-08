import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { User } from './entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashHelper } from '../helpers/hash.helper.js';
import { Role } from '../role/entities/role.entity.js';
import { DeliveryAddress } from './entities/delivery-address.entity.js';
import { Country } from '../location/entities/country.entity.js';
import { City } from '../location/entities/city.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, DeliveryAddress, Country, City]),
  ],
  controllers: [UserController],
  providers: [UserService, HashHelper],
  exports: [UserService],
})
export class UserModule {}
