import S from 'fluent-json-schema'

import authentication from '../plugins/authentication.js'
import loadSchemas from '../plugins/loadSchemas.js'

import miscRoutes from './misc/index.js'
import authRoutes from './auth/index.js'

export default async function index(fastify) {
  fastify.register(loadSchemas)
  fastify.register(authentication)

  /**
   * Additional request logs
   */
  fastify.addHook('preValidation', async req => {
    const { body, log, user } = req

    if (user) {
      log.debug(
        {
          userId: user.id,
          email: user.email,
        },
        'user'
      )
    }

    if (fastify.config.LOG_REQ_BODY && body) {
      log.debug(body, 'parsed body')
    }
  })

  /**
   * Common route stuff
   */
  fastify.addHook('onRoute', options => {
    options.schema = {
      ...options.schema,
      headers: S.object()
        .additionalProperties(true)
        .prop('Accept-Version', S.string())
        .description('Api version header.')
        .required(),
      response: {
        ...options.schema.response,
        400: fastify.getSchema('sBadRequest'),
        401: fastify.getSchema('sUnauthorized'),
      },
    }

    if (!options.config.public) {
      options.schema = {
        ...options.schema,
        headers: {
          ...options.schema.headers
            .prop('Authorization', S.string())
            .description('Authentication bearer token.')
            .required(),
        },
      }
    }
  })

  /**
   * Format errors
   */
  fastify.addHook('onError', async (req, reply, error) => {
    const { log } = req

    error.internalCode = error.internalCode || '0000'
    error.details = {}

    if (reply.statusCode === 400) {
      log.warn({ validation: error.validation }, 'invalid input')

      error.details.validation = error.validation
      error.message = 'Invalid input'
    }
  })

  fastify.register(miscRoutes)
  fastify.register(authRoutes)
}
