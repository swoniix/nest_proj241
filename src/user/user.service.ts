import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserReqDto } from './dto/create-user.req.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { HashHelper } from '../helpers/hash.helper.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { DeliveryAddress } from './entities/delivery-address.entity.js';
import { Country } from '../location/entities/country.entity.js';
import { City } from '../location/entities/city.entity.js';
import { UpdateDeliveryAddressDto } from './dto/update-delivery-address.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
    @InjectRepository(DeliveryAddress)
    private readonly _addressRepository: Repository<DeliveryAddress>,
    @InjectRepository(Country)
    private readonly _countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly _cityRepository: Repository<City>,
    private readonly _hashHelper: HashHelper,
  ) {}

  async create(createUserDto: CreateUserReqDto) {
    const user = await this._repository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user != null) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const hash = await this._hashHelper.hash(createUserDto.password);
    const result = this._repository.create({
      fullname: createUserDto.fullname,
      email: createUserDto.email,
      is_block: createUserDto.is_block,
      password_hash: hash,
      role: { id: 2 },
    });
    const savedUser = await this._repository.save(result);

    return {
      id: savedUser.id,
      email: savedUser.email,
      fullname: savedUser.fullname,
      is_block: savedUser.is_block,
      delivery_address: null,
    };
  }

  async validateCredentials(email: string, password: string) {
    const user = await this._repository.findOne({ where: { email } });
    if (!user || user.is_block) {
      return null;
    }

    const isValid = await this._hashHelper.isValidPassword(
      password,
      user.password_hash,
    );
    return isValid ? { id: user.id, email: user.email } : null;
  }

  async hasRole(userId: number, roleName: string): Promise<boolean> {
    const user = await this._repository.findOne({
      where: { id: userId },
      relations: { role: true },
    });

    return user?.role?.name === roleName;
  }

  // Homework 30.09: логіка GET-запитів для користувачів
  async findAll() {
    // Беремо всіх користувачів з бази даних
    const users = await this._repository.find({
      relations: {
        delivery_address: { country: true, city: true },
      },
    });

    // Не повертаємо password_hash у відповіді
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      is_block: user.is_block,
      delivery_address: user.delivery_address ?? null,
    }));
  }

  async findOne(id: number) {
    // Шукаємо користувача за id
    const user = await this._repository.findOne({
      where: { id },
      relations: {
        delivery_address: { country: true, city: true },
      },
    });
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      is_block: user.is_block,
      delivery_address: user.delivery_address ?? null,
    };
  }

  // Homework 30.09: логіка часткового оновлення користувача
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Спочатку перевіряємо, чи існує такий користувач
    const user = await this._repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Якщо змінюємо email, перевіряємо, щоб він не був зайнятий
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const userWithSameEmail = await this._repository.findOne({
        where: { email: updateUserDto.email },
      });
      if (userWithSameEmail) {
        throw new ConflictException('Користувач з таким email вже існує');
      }
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.fullname !== undefined) {
      user.fullname = updateUserDto.fullname;
    }
    if (updateUserDto.is_block !== undefined) {
      user.is_block = updateUserDto.is_block;
    }
    if (updateUserDto.password !== undefined) {
      // Новий пароль теж обов'язково зберігаємо як хеш
      user.password_hash = await this._hashHelper.hash(updateUserDto.password);
    }

    await this._repository.save(user);
    return this.findOne(id);
  }

  // Homework 30.09: логіка видалення користувача
  async remove(id: number) {
    // Перед видаленням перевіряємо, чи є користувач у базі
    const user = await this._repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    await this._repository.remove(user);
    return { message: 'Користувача успішно видалено' };
  }

  async updateDeliveryAddress(
    id: number,
    updateAddressDto: UpdateDeliveryAddressDto,
  ) {
    const user = await this._repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const country = await this._countryRepository.findOneBy({
      id: updateAddressDto.country_id,
    });
    const city = await this._cityRepository.findOne({
      where: { id: updateAddressDto.city_id },
      relations: { country: true },
    });

    if (!country || !city) {
      throw new NotFoundException('Країну або місто не знайдено');
    }
    if (city.country.id !== country.id) {
      throw new BadRequestException('Місто не належить вибраній країні');
    }

    let deliveryAddress = await this._addressRepository.findOne({
      where: { user: { id } },
    });
    if (!deliveryAddress) {
      deliveryAddress = this._addressRepository.create({ user });
    }

    deliveryAddress.address = updateAddressDto.address;
    deliveryAddress.postal_code = updateAddressDto.postal_code ?? null;
    deliveryAddress.country = country;
    deliveryAddress.city = city;
    await this._addressRepository.save(deliveryAddress);

    return this.findOne(id);
  }
}
