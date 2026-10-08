import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity.js';
import { City } from './entities/city.entity.js';
import { LocationController } from './location.controller.js';
import { LocationService } from './location.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Country, City])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
