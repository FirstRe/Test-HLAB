import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Products (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/products/create (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/products/create')
      .send({
        description: 'apple macbook',
        year: '2224',
        products: [
          {
            name: 'macbook pro m15',
            lang: 'en',
            description: 'apple macbook pro',
          },
          {
            name: 'แม็คบุคโปร เอ็ม15',
            lang: 'th',
            description: 'แม็คบุคโปร เอ็ม4 แอปเปิ้ล',
          },
        ],
      })

    expect(res.statusCode).toBe(201)
  })

  it('/products/search (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/products/search')
      .query({ query: 'Camera', page: 1, limit: 10 })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.products[0]?.name).toContain('Camera')
  })
})
