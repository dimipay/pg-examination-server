import qs from 'qs'
import axios from 'lib/axios'
import config from 'config'
import crypto from 'crypto'
import prisma from 'lib/prisma'
import random from 'lib/random'
import { sha256 } from 'lib/token'
import { HttpError } from 'lib/error'
import nicepayBasicAuth from 'lib/nicepayBasicAuth'

import type { Response } from 'express'
import type { AxiosPromise } from 'axios'
import type { KeyRequest } from 'interface/body'
import type { BillKeyRes } from 'interface/nicepay'

const generateEncDate = (data: string): string => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(config.clientSecret.substring(0, 32)),
    Buffer.from(config.clientSecret.substring(0, 16))
  );

  return Buffer.concat([cipher.update(data), cipher.final()]).toString('hex');
}

export default async (req: KeyRequest, res: Response) => {
  const cardData = { ...req.body }
  delete cardData.cardName
  const plainCardData = qs.stringify(cardData)
  const cardHash = sha256(req.body.cardNo)

  const existingCard = await prisma.card.findFirst({
    where: {
      userId: req.user.id,
      hash: cardHash,
    },
  })

  if (existingCard) {
    throw new HttpError(
      400,
      '이미 등록된 카드입니다.',
      'CARD_ALREADY_REGISTERED'
    )
  }
  
  const { data: response } = await (<AxiosPromise<BillKeyRes>>axios({
    url: 'v1/subscribe/regist',
    method: 'post',
    data: {
      encData: generateEncDate(plainCardData),
      orderId: random(6),
      encMode: 'A2'
    },
  }))
  
  if (response.resultCode !== '0000') {
    throw new HttpError(
      400,
      '카드 정보가 올바르지 않습니다.',
      'CARD_INFO_NOT_MATCH'
    )
  }

  const card = await prisma.card.create({
    data: {
      billKey: response.bid,
      name: req.body.cardName || response.cardName,
      hash: cardHash,
      USER: { connect: { id: req.user.id } },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  })

  res.status(201).json({
    id: card.id,
    name: card.name,
    createdAt: card.createdAt,
  })
}
