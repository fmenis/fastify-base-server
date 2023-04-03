import Fastify from 'fastify'
import closeWithGrace from 'close-with-grace'
import env from '@fastify/env'

import { buildServerOptions } from './src/utils/buildServeOptions.js'
import { sEnv } from './src/utils/env.schema.js'
import app from './src/app.js'

const fastify = Fastify(buildServerOptions())

await fastify.register(env, {
  schema: sEnv(),
})

await fastify.register(app)
await fastify.ready()

closeWithGrace({ delay: 500 }, async ({ signal, err }) => {
  const { log } = fastify
  if (err) {
    log.error(err)
  }
  log.debug(`'${signal}' signal receiced. Gracefully closing fastify server`)
  await fastify.close()
})

fastify.listen(
  {
    port: fastify.config.SERVER_PORT,
    host: fastify.config.SERVER_ADDRESS,
  },
  err => {
    const { log } = fastify

    if (err) {
      log.fatal(err)
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }

    const httpVersion = fastify.config.ENABLE_HTTP2 ? 2 : 1
    log.info(
      `Server launched in '${fastify.config.NODE_ENV}' environment (http version ${httpVersion})`
    )
  }
)
