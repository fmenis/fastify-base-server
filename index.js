import Fastify from 'fastify'
import Env from '@fastify/env'

import { sEnv } from './src/utils/env.schema.js'
import { buildServerOptions } from './src/utils/buildServeOptions.js'

import App from './src/app.js'

const fastify = Fastify(buildServerOptions())

fastify.register(Env, {
  schema: sEnv(),
})

fastify.register(App)

fastify.listen(
  { port: process.env.SERVER_PORT, host: process.env.SERVER_ADDRESS },
  err => {
    const { log } = fastify

    if (err) {
      log.error(err)
      throw new Error(err)
    }

    log.info(`Server running in '${process.env.NODE_ENV}' mode`)
  }
)
