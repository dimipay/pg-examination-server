import prisma from 'lib/prisma'

import type { Request, Response } from 'express'

export default async (req: Request, res: Response) => {
  const history = await prisma.transaction.findMany({
    where: {
      userId: req.user.id,
    },
    select: {
      id: true,
      price: true,
      canceled: true,
      createdAt: true,
      updatedAt: true,
      productName: true,
    },
  })

  res.json(history)
}
