import prisma from 'lib/prisma'

import type { Response, Request } from 'express'

export default async (req: Request, res: Response) => {
  const cards = await prisma.card.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      name: true,
      type: true,
      createdAt: true,
    },
  })

  res.json(cards)
}
