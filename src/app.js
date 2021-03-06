import Sensible from '@fastify/sensible'
import Cors from '@fastify/cors'
import Helmet from '@fastify/helmet'

import apiPlugin from './routes/index.js'
import swaggerGeneratorPlugin from './plugins/swagger.js'
import postgresPlugin from './plugins/postgres.js'

export default async function app(fastify, opts) {
  fastify.register(Sensible)
  fastify.register(Helmet)

  fastify.register(Cors, {
    origin: true,
    credentials: true,
  })

  fastify.register(swaggerGeneratorPlugin)
  fastify.register(postgresPlugin, opts)
  fastify.register(apiPlugin, { prefix: '/api' })
}
