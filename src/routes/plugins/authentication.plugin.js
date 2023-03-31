import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

async function authentication(fastify) {
  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
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
      log.debug(`User with email '${token.email}' not found`)
      throw httpErrors.unauthorized('Invalid access')
    }

    req.user = user
  }

  fastify.addHook('onRequest', authenticate)
}

async function verifyToken(fastify, req) {
  const { jwt, httpErrors, log } = fastify

  const header = req.headers.authorization
  if (!header) {
    log.debug(`'Authorization' header not found`)
    throw httpErrors.unauthorized('Invalid access')
  }

  const [identifier, rawJwt] = header.split(' ')

  if (identifier !== 'Bearer') {
    log.debug(`Malformed 'Authorization' header (no Bearer part)`)
    throw httpErrors.unauthorized('Invalid access')
  }

  if (!rawJwt) {
    log.debug(`Malformed 'Authorization' header (no token part)`)
    throw httpErrors.unauthorized('Invalid access')
  }

  try {
    const token = await jwt.verify(rawJwt)
    return token
  } catch (error) {
    if (error?.code) {
      switch (error.code) {
        case 'FAST_JWT_MALFORMED':
          log.debug(`Malformed jwt`)
          break

        case 'FAST_JWT_EXPIRED':
          log.debug(`Expired jwt`)
          break

        case 'FAST_JWT_INVALID_SIGNATURE':
          log.debug(`Expired jwt`)
          break

        default:
          log.warn(`Unknown jwt error '${error.code}'`)
          break
      }
    } else {
      throw error
    }

    throw httpErrors.unauthorized('Invalid access')
  }
}

export default fp(authentication)
