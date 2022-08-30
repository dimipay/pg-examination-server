import qs from 'qs'
import axios from 'axios'
import moment from 'moment'
import config from 'config'
import prisma from 'lib/prisma'
import random from 'lib/random'
import { sha256 } from 'lib/token'
import { HttpError } from 'lib/error'

import type { Response } from 'express'
import type { AxiosPromise } from 'axios'
import type { CancelRequest } from 'interface/body'
import type { BillkeyCancelRes } from 'interface/nicepay'

export default async (req: CancelRequest, res: Response) => {
  const { transactionId } = req.body

  const transaction = await prisma.transaction.findFirst({
    where: {
      canceled: false,
      id: transactionId,
      userId: req.user.id,
    },
  })

  if (!transaction) {
    throw new HttpError(404, '존재하지 않는 거래입니다.')
  }

  const orderNo = random(6)
  const now = moment().format('YYYYMMDDHHmmss')

  const response = await (<AxiosPromise<BillkeyCancelRes>>axios({
    url: 'https://webapi.nicepay.co.kr/webapi/cancel_process.jsp',
    method: 'POST',
    data: qs.stringify({
      EdiDate: now,
      Moid: orderNo,
      CharSet: 'utf-8',
      CancelMsg: '취소',
      TID: transaction.tid,
      MID: config.storeId,
      PartialCancelCode: '0',
      CancelAmt: transaction.price,
      SignData: sha256(
        config.storeId + transaction.price + now + config.storeKey
      ),
    }),
  }))

  if (response.data.ResultCode !== '2001') {
    throw new HttpError(500, response.data.ResultMsg, response.data.ResultCode)
  }

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { canceled: true },
  })

  res.sendStatus(200)
}
