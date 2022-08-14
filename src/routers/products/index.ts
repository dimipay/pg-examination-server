import get from './get'

import checkRouter from 'lib/checkRouter'

export default checkRouter({
  root: '/products',
  routers: [
    {
      path: '/',
      method: 'get',
      needAuth: false,
      handler: get,
    },
  ],
})
