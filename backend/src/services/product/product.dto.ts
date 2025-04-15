import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @Length(4, 4)
  @IsOptional()
  year: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsNotEmpty()
  products: ProductDto[]
}

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  lang: string

  @IsString()
  @IsNotEmpty()
  description: string
}
