import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'

async function authentication(fastify) {
  const { config } = fastify

  fastify.register(cookie, {
    secret: config.COOKIE_SECRET,
    parseOptions: {},
  })

  fastify.register(jwt, {
    secret: config.JWT_SECRET,
    cookie: {
      cookieName: config.COOKIE_NAME,
      signed: true,
    },
  })

  async function authenticate(req, reply) {
    const { pg, httpErrors } = fastify
    const { log } = req

    if (reply.context.config.public) {
      return
    }

    const token = await verifyToken(fastify, req)

    const user = await pg.users.findOne({ email: token.email })
    if (!user) {
      log.debug(`Invalid access: user with email '${token.email}' not found`)
      throw httpErrors.unauthorized('Invalid access')
    }

    req.user = user
  }

  fastify.addHook('onRequest', authenticate)
}

async function verifyToken(fastify, req) {
  const { jwt, httpErrors, log, config } = fastify

  try {
    const rawJwt = req.cookies[config.COOKIE_NAME]
    if (!rawJwt) {
      log.debug(`Invalid access: authentication cookie not found`)
      throw httpErrors.unauthorized('Invalid access')
    }

    const token = await jwt.verify(rawJwt)

    return token
  } catch (error) {
    if (error?.code) {
      switch (error.code) {
        case 'FAST_JWT_MALFORMED':
          log.debug(`Invalid access: malformed jwt`)
          break

        case 'FAST_JWT_EXPIRED':
          log.debug(`Invalid access: expired jwt`)
          break

        case 'FAST_JWT_INVALID_SIGNATURE':
          log.debug(`Invalid access: invalid jwt signature`)
          break

        default:
          log.warn(`Invalid access: unknown token error '${error.code}'`)
          break
      }
    } else {
      log.error(error)
    }

    throw httpErrors.unauthorized('Invalid access')
  }
}

export default fp(authentication)
