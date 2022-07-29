import S from 'fluent-json-schema'

import { appConfig } from '../../config/main.js'

export default async function login(fastify) {
  const { pg, httpErrors, bcrypt, jwt } = fastify

  fastify.route({
    method: 'POST',
    url: '/login',
    config: {
      public: true,
    },
    constraints: { version: '1.0.0' },
    schema: {
      summary: 'Login',
      description: 'Authenticate user into the system.',
      body: S.object()
        .additionalProperties(false)
        .prop('email', S.string().format('email').minLength(8).maxLength(50))
        .description('User email.')
        .prop('username', S.string().minLength(3).maxLength(50))
        .description('User name.')
        .prop(
          'password',
          S.string().minLength(8).maxLength(50) /*.pattern(passwordRexExp)*/
        )
        .description('User password.')
        .required(),
      response: {
        200: S.object()
          .additionalProperties(false)
          .prop('jwt', S.string())
          .description('Json web token')
          .required(),
      },
    },
    preValidation: async req => {
      if (!req.body.email && !req.body.username) {
        req.log.debug('Both username and password are empty')
        throw httpErrors.badRequest('Username and email cannot be both empty')
      }
    },
    handler: onLogin,
  })

  async function onLogin(req, reply) {
    const { username, email, password } = req.body
    const { log } = req

    const user = await pg.users.findOne({ or: [{ username }, { email }] })
    if (!user) {
      log.debug(`Invalid access: user '${email || username}' not found`)
      throw httpErrors.unauthorized('Invalid access: wrong credentials')
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      log.debug(`Invalid access: password not match`)
      throw httpErrors.unauthorized('Invalid access: wrong credentials')
    }

    const options = {
      expiresIn: appConfig.jwt.expiresIn,
      iss: 'api.example.it',
      sub: 'fastify-sample',
    }

    const payload = {
      email: user.email,
    }

    const token = jwt.sign(payload, options)

    reply
      .setCookie(fastify.config.COOKIE_NAME, token, {
        // domain: 'your.domain',
        path: '/',
        // secure: true, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true,
      })
      .code(200)
  }
}
