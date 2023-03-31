import Fastify from 'fastify'
import closeWithGrace from 'close-with-grace'

import { buildServerOptions } from './src/utils/buildServeOptions.js'
import App from './src/app.js'

const fastify = Fastify(buildServerOptions())

await fastify.register(App)
await fastify.ready()

closeWithGrace({ delay: 500 }, async ({ signal, err }) => {
  const { log } = fastify
  if (err) {
    log.error(err)
  }
  log.debug(`'${signal}' signal receiced. Gracefully closing fastify server`)
  await fastify.close()
})

const port = process.env.SERVER_PORT || 3000
const host = process.env.SERVER_ADDRESS || '127.0.0.1'

fastify.listen({ port, host }, err => {
  const { log } = fastify

  if (err) {
    log.fatal(err)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }

  log.info(`Server running in '${process.env.NODE_ENV}' mode`)
})
