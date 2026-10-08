import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateDeliveryAddressDto {
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postal_code?: string;

  @IsInt()
  country_id: number;

  @IsInt()
  city_id: number;
}
