import { Test } from '@nestjs/testing'
import { PrismaService } from '../../common/prisma/prisma.service'
import { PrismaClient } from '@prisma/client'
import { ProductsService } from './product.service'

describe('ProductsService (Integration)', () => {
  let service: ProductsService
  let prisma: PrismaClient

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile()

    service = module.get(ProductsService)
    prisma = module.get(PrismaService)
  })

  beforeEach(async () => {
  })

  it('should create and search a product', async () => {
    const nameTh = 'กล้อง' + Math.random()
    const nameEn = 'Camera' + Math.random()
    await service.create({
      products: [
        {
          lang: 'en',
          name: nameTh,
          description: 'Digital Camera',
        },
        {
          lang: 'th',
          name: nameEn,
          description: 'กล้องดิจิตอล',
        },
      ],
      description: '',
      year: '',
    })

    const result = await service.search(nameEn, 1, 10)
    expect(result.data.products[0].name).toBe(nameEn)
  })
})
