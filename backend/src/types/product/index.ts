type Status = {
  code: number
  message: string
}

type ProductType = {
  id: string
  year?: string
  name: string
  language: string
  description: string
  createdAt: string
}

type GetProductsDataType = {
  products: ProductType[]
  totalRow: number
  pageNo: number
  pageLimit: number
  totalPage: number
}

type GetProductsResponseType = {
  data: GetProductsDataType
  status: Status
}

type CreateProductsResponseType = {
  data: null
  status: Status
}

export type {
  CreateProductsResponseType,
  ProductType,
  GetProductsResponseType,
  GetProductsDataType,
}
