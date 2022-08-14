import checkRouter from 'lib/checkRouter'

export default checkRouter({
  root: '/test',
  routers: [
    {
      path: '/',
      method: 'get',
      needAuth: true,
      handler: async (req, res, next) => {
        res.json({
          message: 'Hello World',
        })
      }
    },
  ],
})
