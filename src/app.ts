import express from 'express'
import config from './config'

import type { Application } from 'express'

export default class {
  public app: Application

  constructor() {
    this.app = express()
  }

  public listen(port = config.port): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
}
