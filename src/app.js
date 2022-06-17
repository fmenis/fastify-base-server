import Sensible from '@fastify/sensible'
import Cors from '@fastify/cors'
import Helmet from '@fastify/helmet'

import apiPlugin from './routes/index.js'
import swaggerPlugin from './plugins/swagger.js'

export default async function app(fastify) {
  fastify.register(Sensible)
  fastify.register(Helmet)

  fastify.register(Cors, {
    origin: true,
    credentials: true,
  })

  fastify.register(swaggerPlugin)
  fastify.register(apiPlugin, { prefix: '/api' })
}
