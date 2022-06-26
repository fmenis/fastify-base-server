import authentication from '../plugins/authentication.js'
import loadSchemas from '../plugins/loadSchemas.js'

import miscRoutes from './misc/index.js'
import authRoutes from './auth/index.js'

export default async function index(fastify) {
  fastify.register(loadSchemas)
  fastify.register(authentication)

  fastify.register(miscRoutes)
  fastify.register(authRoutes)
}
