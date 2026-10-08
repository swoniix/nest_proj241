import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity.js';
import { City } from './entities/city.entity.js';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Country)
    private readonly _countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly _cityRepository: Repository<City>,
  ) {}

  async findAllCountries() {
    return this._countryRepository.find({ order: { name: 'ASC' } });
  }

  async findCitiesByCountry(countryId: number) {
    return this._cityRepository.find({
      where: { country: { id: countryId } },
      order: { name: 'ASC' },
    });
  }
}
