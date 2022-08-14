import prisma from 'lib/prisma'
import { verify } from 'lib/token'

import type { Request, Response, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id } = verify(req.token, false)

  req.user = await prisma.user.findUniqueOrThrow({ where: { id } })
  
  return next()
}
