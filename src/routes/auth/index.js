import bcrypt from 'fastify-bcrypt'

import loginRoute from './login.js'

export default async function index(fastify) {
  fastify.register(bcrypt)

  fastify.addHook('onRoute', options => {
    options.schema = {
      ...options.schema,
      tags: ['auth'],
    }
  })

  const prefix = '/auth'
  fastify.register(loginRoute, { prefix })
}
