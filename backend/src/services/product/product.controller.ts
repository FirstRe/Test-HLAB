import { Controller, Get, Post, Query, Body, Logger } from '@nestjs/common'
import { ProductsService } from './product.service'
import { CreateProductDto } from './product.dto'
import {
  CreateProductsResponseType,
  GetProductsResponseType,
} from 'src/types/product'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  create(@Body() dto: CreateProductDto): Promise<CreateProductsResponseType> {
    return this.productsService.create(dto)
  }

  @Get('search')
  search(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<GetProductsResponseType> {
    return this.productsService.search(query, +page, +limit)
  }
}
