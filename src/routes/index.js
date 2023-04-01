import commonHooks from './plugins/commonHooks.js'
import swagger from './plugins/swagger.plugin.js'
import loadSchemas from './plugins/loadSchema.plugin.js'
import commonErrors from './plugins/commonErrors.plugin.js'
// import authentication from './plugins/authentication.plugin.js'

import miscRoutes from './misc/index.js'
// import authRoutes from './auth/index.js'

export default async function index(fastify) {
  fastify.register(swagger)
  fastify.register(loadSchemas)
  fastify.register(commonHooks)
  fastify.register(commonErrors)
  //##TODO impostare auth
  // fastify.register(authentication)

  fastify.register(miscRoutes)
  // fastify.register(authRoutes)
}
