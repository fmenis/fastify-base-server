import Fastify from 'fastify'

import { readFileSync } from 'fs'
import { join, resolve } from 'path'

import App from './src/app.js'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL,
    // prettyPrint: process.env.NODE_ENV !== "production", ##TODO
  },
  trustProxy: true,
  ajv: {
    customOptions: {
      allErrors: true,
    },
  },
  http2: true,
  https: {
    key: readFileSync(join(resolve(), 'certs', 'local-fastify.key')),
    cert: readFileSync(join(resolve(), 'certs', 'local-fastify.crt')),
  },
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

  log.info(`Server running in ${process.env.NODE_ENV} mode`)
})
