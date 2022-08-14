import prisma from 'lib/prisma'

import type { Request, Response } from 'express'

const products = (async () =>
  await prisma.products.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      detail: true,
    },
  }))()

export default async (req: Request, res: Response) => {
  res.json(products)
}
