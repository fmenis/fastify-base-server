import Sensible from '@fastify/sensible'
import Cors from '@fastify/cors'
import Helmet from '@fastify/helmet'
import Env from '@fastify/env'
import fp from 'fastify-plugin'
import massive from 'fastify-massive'

import { sEnv } from './utils/env.schema.js'
import apiPlugin from './routes/index.js'
import { appConfig } from './config/main.js'

async function app(fastify, opts) {
  fastify.decorate('appConfig', appConfig)

  fastify.register(Env, {
    schema: sEnv(),
  })
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
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DB,
      user: process.env.PG_USER,
      password: process.env.PG_PW,
    },
  })

  //##TODO impostare sentry

  fastify.register(apiPlugin, { prefix: '/api' })
}

export default fp(app)
