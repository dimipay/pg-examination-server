import qs from 'qs'
import axios from 'axios'
import moment from 'moment'
import config from 'config'
import crypto from 'crypto'
import prisma from 'lib/prisma'
import random from 'lib/random'
import { sha256 } from 'lib/token'
import { HttpError } from 'lib/error'
import { getCard, getProduct } from './get'

import type { Response } from 'express'
import type { AxiosPromise } from 'axios'
import type { PaymentRequest } from 'interface/body'
import type { BillkeyApprovalRes } from 'interface/nicepay'

export default async (req: PaymentRequest, res: Response) => {
  const { productId, cardId } = req.body

  const card = await getCard(cardId, req.user.id)
  const product = await getProduct(productId)

  const orderId = random(6)
  const now = moment().format('YYYYMMDDHHmmss')
  const TID = config.storeId + '0116' + now.substring(2) + random(2)

  const response = await (<AxiosPromise<BillkeyApprovalRes>>axios({
    url: 'https://webapi.nicepay.co.kr/webapi/billing/billing_approve.jsp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      TID,
      EdiDate: now,
      Moid: orderId,
      CardQuota: '00',
      CharSet: 'utf-8',
      CardInterest: '0',
      BID: card.billKey,
      Amt: product.price,
      MID: config.storeId,
      GoodsName: 'H2CARE TEST',
      SignData: sha256(
        config.storeId +
          now +
          orderId +
          product.price +
          card.billKey +
          config.storeKey
      ),
    }),
  }))

  if (response.data.ResultCode !== '3001') {
    throw new HttpError(500, response.data.ResultMsg, response.data.ResultCode)
  }

  const transaction = await prisma.transaction.create({
    data: {
      TID,
      id: orderId,
      price: product.price,
      productName: product.name,
      USER: { connect: { id: req.user.id } },
      PRODUCT: { connect: { id: productId } },
    },
    select: {
      id: true,
      price: true,
      createdAt: true,
      productName: true,
    },
  })

  res.json(transaction)
}
