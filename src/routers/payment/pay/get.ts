import prisma from 'lib/prisma'
import { HttpError } from 'lib/error'

export const getCard = async (id: string, userId: string) => {
  const card = await prisma.card.findUnique({
    where: { id_userId: { id, userId } },
    select: { billKey: true },
  })

  if (!card) {
    throw new HttpError(400, '카드 정보가 없습니다.')
  }

  return card
}

export const getProduct = async (id: string) => {
  const product = await prisma.products.findUnique({
    where: { id },
    select: { name: true, price: true },
  })

  if (!product) {
    throw new HttpError(400, '상품 정보가 없습니다.')
  }

  return product
}
