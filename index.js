import Fastify from 'fastify'

import { buildServerOptions } from './src/utils/buildServeOptions.js'
import App from './src/app.js'

const fastify = Fastify(buildServerOptions())

fastify.register(App)

fastify.listen(
  {
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_ADDRESS,
  },
  err => {
    const { log } = fastify

    if (err) {
      log.fatal(err)
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }

    log.info(`Server running in '${process.env.NODE_ENV}' mode`)
  }
)
