import Fastify from 'fastify'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import Env from '@fastify/env'
import { stdTimeFunctions } from 'pino'

import { ENV } from './src/common/enums.js'
import { sEnv } from './src/common/schemas/env.schema.js'

import App from './src/app.js'

const serverOptions = {
  logger: {
    level: process.env.LOG_LEVEL,
    timestamp: () => stdTimeFunctions.isoTime(),
  },
  trustProxy: true,
  ajv: {
    customOptions: {
      allErrors: true,
    },
  },
}

if (process.env.HTTP2 === 'enabled') {
  serverOptions.http2 = true

  if (process.env.NODE_ENV === ENV.DEVELOPMENT) {
    serverOptions.https = {
      key: readFileSync(join(resolve(), 'certs', 'local-fastify.key')),
      cert: readFileSync(join(resolve(), 'certs', 'local-fastify.crt')),
    }
  }
}

const fastify = Fastify(serverOptions)

fastify.register(Env, {
  schema: sEnv(),
})

fastify.register(App)

const port = process.env.SERVER_PORT || 3000
const host = process.env.SERVER_ADDRESS || '0.0.0.0'

fastify.listen({ port, host }, err => {
  const { log } = fastify

  if (err) {
    log.error(err)
    throw new Error(err)
  }

  log.info(`Server running in '${process.env.NODE_ENV}' mode`)
})
