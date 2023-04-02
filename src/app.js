import Sensible from '@fastify/sensible'
import Cors from '@fastify/cors'
import Helmet from '@fastify/helmet'
import Env from '@fastify/env'
import fp from 'fastify-plugin'
import massive from 'fastify-massive'
import sentry from '@immobiliarelabs/fastify-sentry'

import { sEnv } from './utils/env.schema.js'
import apiPlugin from './routes/index.js'
import { appConfig } from './config/main.js'
import { ENV } from './routes/common/enum.js'
import { getServerVersion } from './routes/common/utils.js'

async function app(fastify, opts) {
  //##TODO capire bene storia await dei plugin
  await fastify.register(Env, {
    schema: sEnv(),
  })

  fastify.decorate('appConfig', appConfig)

  fastify.register(Sensible)
  fastify.register(Helmet, {
    contentSecurityPolicy: {
      // helmet + swagger configs
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  })

  fastify.register(Cors, {
    origin: true,
    credentials: true,
  })

  fastify.register(massive, {
    massive: {
      host: fastify.config.PG_HOST,
      port: fastify.config.PG_PORT,
      database: fastify.config.PG_DB,
      user: fastify.config.PG_USER,
      password: fastify.config.PG_PW,
    },
  })

  if (fastify.config.ENABLE_SENTRY) {
    fastify.register(sentry, {
      //##TODO studiare configurazioni
      dsn: fastify.config.SENTRY_DSN,
      environment: fastify.config.NODE_ENV,
      release: getServerVersion(),
      enabled: fastify.config.NODE_ENV !== ENV.LOCAL,
      onErrorFactory: () => {
        return function (error, req, reply) {
          reply.send(error)
          if (
            fastify.config.NODE_ENV !== ENV.LOCAL &&
            reply.statusCode === 500
          ) {
            this.Sentry.captureException(error)
          }
        }
      },
    })
  }

  fastify.register(apiPlugin, { prefix: '/api' })
}

export default fp(app)
