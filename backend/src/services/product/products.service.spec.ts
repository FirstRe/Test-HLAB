import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../common/prisma/prisma.service'
import { HttpException } from '@nestjs/common'
import { ProductsService } from '../../services/product/product.service'

const prismaMock = {
  productMultilingual: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  product: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
}

describe('ProductsService', () => {
  let productService: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile()

    productService = module.get<ProductsService>(ProductsService)
    prismaMock.productMultilingual.findMany.mockClear()
    prismaMock.productMultilingual.count.mockClear()
    prismaMock.product.create.mockClear()
    prismaMock.$transaction.mockClear()
  })

  afterEach(() => jest.clearAllMocks())

  it('should return search results', async () => {
    const mockData = [
      {
        id: '1',
        name: 'Test',
        description: 'Test desc',
        language: 'en',
        createdAt: new Date(),
        product: { year: 2023 },
      },
    ]

    prismaMock.productMultilingual.findMany.mockResolvedValue(mockData)

    prismaMock.productMultilingual.count.mockResolvedValue(1)

    const result = await productService.search('Test', 1, 10)

    expect(result.data.products).toHaveLength(1)
    expect(result.status.code).toBe(200)
  })

  it('should return status OK', async () => {
    prismaMock.productMultilingual.findMany.mockResolvedValue([])

    const result = await productService.create({
      products: [
        { lang: 'en', name: 'Macbook m1', description: '13 inch 512G' },
      ],
      description: '13 inch',
      year: '2021',
    })
    expect(result.status.code).toBe(200)
  })

  it('should return status on duplicate', async () => {
    const mockData = [
      {
        id: '1',
        name: 'Dup',
        description: 'Test desc',
        language: 'en',
        createdAt: new Date(),
        product: { year: 2023 },
      },
    ]

    prismaMock.productMultilingual.findMany.mockResolvedValue(mockData)

    const result = await productService.create({
      products: [{ lang: 'en', name: 'Dup', description: '' }],
      description: '',
      year: '',
    })
    expect(result.status.code).toBe(400)
  })

  it('should throw HttpException Internal error', async () => {
    prismaMock.productMultilingual.findMany.mockImplementation(() => {
      throw new Error('Internal error')
    })
    prismaMock.product.create.mockImplementation(() => {
      throw new Error('Internal error')
    })

    await expect(
      productService.create({
        products: [{ lang: 'en', name: 'Error', description: '' }],
        description: '',
        year: '',
      }),
    ).rejects.toThrow(HttpException)
  })
})
