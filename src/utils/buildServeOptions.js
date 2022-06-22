import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import { stdTimeFunctions } from 'pino'

import { ENV } from '../common/enums.js'

export function buildServerOptions() {
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

  return serverOptions
}
