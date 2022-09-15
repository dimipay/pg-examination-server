import prisma from 'lib/prisma'

export default async (
  data: Record<'tid' | 'orderId' | 'goodsName' | 'userId', string> & {
    amount: number
    productId?: string
  }
) => {
  return await prisma.transaction.create({
    data: {
      tid: data.tid,
      id: data.orderId,
      price: data.amount,
      productName: data.goodsName,
      USER: { connect: { id: data.userId } },
      ...(data.productId
        ? { PRODUCT: { connect: { id: data.productId } } }
        : {}),
    },
    select: {
      id: true,
      price: true,
      createdAt: true,
      productName: true,
    },
  })
}
