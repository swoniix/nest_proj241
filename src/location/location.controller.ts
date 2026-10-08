import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator.js';
import { LocationService } from './location.service.js';

@Public()
@Controller('location')
export class LocationController {
  constructor(private readonly _locationService: LocationService) {}

  @Get('countries')
  findAllCountries() {
    return this._locationService.findAllCountries();
  }

  @Get('countries/:countryId/cities')
  findCitiesByCountry(@Param('countryId') countryId: string) {
    return this._locationService.findCitiesByCountry(+countryId);
  }
}
