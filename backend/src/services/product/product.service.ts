import {
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { CreateProductDto } from './product.dto'
import {
  CreateProductsResponseType,
  GetProductsResponseType,
  ProductType,
} from 'src/types/product'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name)
  constructor(private readonly repos: PrismaService) {}

  async search(
    query: string,
    page: number,
    limit: number,
  ): Promise<GetProductsResponseType> {
    try {
      const data = await this.repos.productMultilingual.findMany({
        where: {
          name: {
            contains: `%${query}%`,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          product: true,
        },
      })

      const total = await this.repos.productMultilingual.count({
        where: {
          name: {
            contains: `%${query}%`,
          },
        },
      })
      this.logger.log({ data, total, page, limit })

      let products: ProductType[] = []

      for (const product of data) {
        products.push({
          id: product.id,
          year: product.product.year,
          name: product.name,
          language: product.language,
          description: product.description,
          createdAt: product.createdAt.toDateString(),
        })
      }

      return {
        data: {
          products,
          totalRow: total,
          pageNo: page,
          pageLimit: limit,
          totalPage: Math.ceil(total / limit),
        },
        status: {
          code: 200,
          message: 'OK',
        },
      }
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('Internal Error', 500)
    }
  }

  async create(
    products: CreateProductDto,
  ): Promise<CreateProductsResponseType> {
    try {
      const names = products.products.map((p) => p.name)

      const findDup = await this.repos.productMultilingual.findMany({
        where: {
          name: {
            in: [...names],
          },
        },
      })

      if (findDup.length > 0) {
        return {
          data: null,
          status: {
            code: 400,
            message: 'Duplicated Data',
          },
        }
      }

      const productMap = products.products.map((p) => ({
        language: p.lang,
        name: p.name,
        description: p.description,
      }))

      const product = this.repos.product.create({
        data: {
          createdBy: 'system',
          products: {
            createMany: {
              data: productMap,
            },
          },
        },
        select: {
          id: true,
        },
      })

      await this.repos.$transaction([product])

      return {
        data: null,
        status: {
          code: 200,
          message: 'OK',
        },
      }
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('Internal Error', 500)
    }
  }
}
