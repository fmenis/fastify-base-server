import S from 'fluent-json-schema'

// import { appConfig } from '../../config/main.js'

export default async function login(fastify) {
  const { pg, httpErrors, bcrypt, jwt } = fastify
  // const { passwordRexExp } = appConfig

  fastify.route({
    method: 'POST',
    url: '/login',
    constraints: { version: '1.0.0' },
    schema: {
      summary: 'Login',
      description: 'Authenticate user into the system.',
      body: S.object()
        .additionalProperties(false)
        .prop('email', S.string().format('email').minLength(8).maxLength(50))
        .description('User email.')
        .prop('username', S.string().minLength(8).maxLength(50))
        .description('User email.')
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
        // 204: fastify.getSchema('sNoContent'),
      },
    },
    preValidation: async req => {
      if (!req.body.email && !req.body.username) {
        req.log.debug('Invalid access: both username and password are empty')
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

    // check pw
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw httpErrors.unauthorized('Invalid access: wrong credentials')
    }

    //TODO opzioni jwt
    const options = {
      expiresIn: 60000 * 60 * 24 * 7,
    }

    const token = jwt.sign(options)
    reply.send({ jwt: token })
  }
}
