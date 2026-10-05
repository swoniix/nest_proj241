import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";


export class CreateProductReqDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsBoolean()
  is_show: boolean;

  @IsInt()
  @Min(1)
  category_id: number;

}
