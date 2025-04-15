import { Module } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { ProductsService } from './product.service'
import { ProductsController } from './product.controller'

@Module({
  imports: [],
  providers: [PrismaService, ProductsService],
  controllers: [ProductsController],
})
export class ProductModule {}
