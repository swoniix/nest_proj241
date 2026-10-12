import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity.js';
import { City } from './entities/city.entity.js';
import { CacheService } from '../cache/cache.service.js';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Country)
    private readonly _countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly _cityRepository: Repository<City>,
    private readonly _cacheService: CacheService,
  ) {}

  async findAllCountries() {
    const cacheKey = 'locations:countries';
    const cachedCountries = await this._cacheService.get<Country[]>(cacheKey);
    if (cachedCountries) {
      return cachedCountries;
    }

    const countries = await this._countryRepository.find({
      order: { name: 'ASC' },
    });
    await this._cacheService.set(cacheKey, countries);
    return countries;
  }

  async findCitiesByCountry(countryId: number) {
    const cacheKey = `locations:country:${countryId}:cities`;
    const cachedCities = await this._cacheService.get<City[]>(cacheKey);
    if (cachedCities) {
      return cachedCities;
    }

    const cities = await this._cityRepository.find({
      where: { country: { id: countryId } },
      order: { name: 'ASC' },
    });
    await this._cacheService.set(cacheKey, cities);
    return cities;
  }
}
