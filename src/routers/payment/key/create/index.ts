import qs from 'qs'
import axios from 'axios'
import moment from 'moment'
import config from 'config'
import crypto from 'crypto'
import prisma from 'lib/prisma'
import random from 'lib/random'
import { sha256 } from 'lib/token'
import { HttpError } from 'lib/error'

import type { Response } from 'express'
import type { AxiosPromise } from 'axios'
import type { KeyRequest } from 'interface/body'
import type { BillKeyRes } from 'interface/nicepay'

const generateEncDate = (data: string): string => {
  const chunks: string[] = []
  const cipher = crypto.createCipheriv(
    'aes-128-ecb',
    config.storeKey.substring(0, 16),
    null
  )
  cipher.setAutoPadding(true)
  chunks.push(cipher.update(data, 'utf8', 'hex'))
  chunks.push(cipher.final('hex'))
  return chunks.join('')
}

export default async (req: KeyRequest, res: Response) => {
  const now = moment().format('YYYYMMDDHHMMSS')
  const orderNo = random(6)
  const cardInfo = qs.stringify(req.body)

  const existingCard = await prisma.card.findFirst({
    where: {
      userId: req.user.id,
      hash: sha256(cardInfo),
    },
  })

  if (existingCard) {
    throw new HttpError(400, '이미 등록된 카드입니다.', 'CARD_ALREADY_REGISTERED')
  }

  const { data: response } = await (<AxiosPromise<BillKeyRes>>axios({
    url: 'https://webapi.nicepay.co.kr/webapi/billing/billing_regist.jsp',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      EdiDate: now,
      Moid: orderNo,
      CharSet: 'utf-8',
      MID: config.storeId,
      EncData: generateEncDate(cardInfo),
      SignData: sha256(config.storeId + now + orderNo + config.storeKey),
    }),
  }))

  if (response.ResultCode !== 'F100') {
    throw new HttpError(
      400,
      '카드 정보가 올바르지 않습니다.',
      'CARD_INFO_NOT_MATCH'
    )
  }

  const card = await prisma.card.create({
    data: {
      billKey: response.BID,
      type: response.CardCl,
      name: req.body.CardName || response.CardName,
      hash: sha256(cardInfo),
      USER: { connect: { id: req.user.id } },
    },
    select: {
      id: true,
      type: true,
      name: true,
      createdAt: true,
    },
  })

  res.status(201).json({
    id: card.id,
    name: card.name,
    type: card.type,
    createdAt: card.createdAt,
  })
}
