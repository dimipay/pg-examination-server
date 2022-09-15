import key from './key'
import pay from './pay'
import cancel from './cancel'
import history from './history'
import serverAuth from './serverAuth'

import Joi from 'joi'
import checkRouter from 'lib/checkRouter'

export default checkRouter({
  root: '/payment',
  routers: [
    {
      path: '/key',
      method: 'get',
      needAuth: true,
      handler: key.get,
    },
    {
      path: '/key',
      method: 'post',
      needAuth: true,
      handler: key.create,
      validation: {
        type: 'body',
        body: {
          cardNo: Joi.string().required(),
          expYear: Joi.string()
            .regex(/^\d{2}$/)
            .required(),
          expMonth: Joi.string()
            .regex(/^\d{2}$/)
            .required(),
          idNo: Joi.alternatives()
            .try(
              Joi.string().regex(/^\d{6}$/), // 생년월일
              Joi.string().regex(/^\d{10}$/) // 사업자번호
            )
            .required(),
          cardPw: Joi.string()
            .regex(/^\d{2}$/)
            .required(),
          cardName: Joi.string(),
        },
      },
    },
    {
      path: '/pay',
      method: 'post',
      needAuth: true,
      handler: pay,
      validation: {
        type: 'body',
        body: {
          cardId: Joi.string().required(),
          productId: Joi.string().required(),
        },
      },
    },
    {
      path: '/cancel',
      method: 'post',
      needAuth: true,
      handler: cancel,
      validation: {
        type: 'body',
        body: {
          transactionId: Joi.string().required(),
        },
      },
    },
    {
      path: '/history',
      method: 'get',
      needAuth: true,
      handler: history,
    },
    {
      path: '/serverAuth',
      method: 'post',
      needAuth: false,
      handler: serverAuth,
    }
  ],
})
