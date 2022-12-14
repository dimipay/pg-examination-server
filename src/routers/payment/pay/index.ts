import qs from 'qs'
import axios from 'lib/axios'
import moment from 'moment'
import config from 'config'
import crypto from 'crypto'
import prisma from 'lib/prisma'
import random from 'lib/random'
import { sha256 } from 'lib/token'
import { HttpError } from 'lib/error'
import { getCard, getProduct } from './get'
import createTransaction from 'lib/createTransaction'

import type { Response } from 'express'
import type { AxiosPromise } from 'axios'
import type { PaymentRequest } from 'interface/body'
import type { BillkeyApprovalRes } from 'interface/nicepay'

export default async (req: PaymentRequest, res: Response) => {
  const { productId, cardId } = req.body

  const orderId = random(6)
  const card = await getCard(cardId, req.user.id)
  const product = await getProduct(productId)

  const { data: response } = await (<AxiosPromise<BillkeyApprovalRes>>axios({
    url: `v1/subscribe/${card.billKey}/payments`,
    method: 'POST',
    data: {
      orderId,
      cardQuota: 0, // 일시불
      amount: product.price,
      goodsName: product.name,
      useShopInterest: false, // false만 사용가능
    },
  }))

  if (response.resultCode !== '0000') {
    throw new HttpError(500, response.resultMsg, response.resultCode)
  }

  const transaction = await createTransaction({
    productId,
    tid: response.tid,
    userId: req.user.id,
    amount: response.amount,
    orderId: response.orderId,
    goodsName: response.goodsName,
  })

  res.json(transaction)
}
