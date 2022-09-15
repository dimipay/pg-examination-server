import axios from 'lib/axios'
import { HttpError } from 'lib/error'
import createTransaction from 'lib/createTransaction'

import type { Response } from 'express'
import type { ServerAuthRequest } from 'interface/body'

export default async (req: ServerAuthRequest, res: Response) => {
  const { data: response } = await axios({
    url: `/v1/payments/${req.body.tid}`,
    method: 'POST',
    data: { amount: req.body.amount },
  })

  if (response.resultCode !== '0000') {
    throw new HttpError(500, response.resultMsg, response.resultCode)
  }

  const transaction = await createTransaction({
    tid: response.tid,
    orderId: response.orderId,
    amount: response.amount,
    goodsName: response.goodsName,
    userId: req.user.id,
  })

  res.json(transaction)
}
