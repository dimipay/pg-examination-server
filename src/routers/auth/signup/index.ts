import prisma from 'lib/prisma'
import { HttpError } from 'lib/error'
import { Prisma } from '@prisma/client'
import { issue, sha256 } from 'lib/token'

import type { SignUpRequest } from 'interface/body'
import type { Response, NextFunction } from 'express'

export default async (
  req: SignUpRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const { id } = await prisma.user.create({
      data: { email, password: sha256(password) },
      select: { id: true },
    })

    res.json({ ...issue(id) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new HttpError(400, '이미 존재하는 이메일입니다.')
      }
    }

    throw new HttpError(500, '서버 오류입니다.')
  }
}
