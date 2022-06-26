import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

async function authentication(fastify) {
  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
  })

  async function authenticate() {
    // const { db, httpErrors, config } = this
    // const { createError } = httpErrors
    // const { log } = req
    // if (reply.context.config.public) {
    //   return
    // }
    // req.user = {
    //   ...user,
    //   session,
    // }
  }

  // fastify.decorateRequest('user', null)
  fastify.addHook('onRequest', authenticate)
}

export default fp(authentication)
