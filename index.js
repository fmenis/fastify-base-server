import Fastify from 'fastify'

import { buildServerOptions } from './src/utils/buildServeOptions.js'
import { applyMigrations } from './scripts/applyMigrations.js'

import App from './src/app.js'

const fastify = Fastify(buildServerOptions())

fastify.register(App)

async function start() {
  try {
    await applyMigrations()

    await fastify.listen({
      port: process.env.SERVER_PORT,
      host: process.env.SERVER_ADDRESS,
    })

    fastify.log.info(`Server running in '${process.env.NODE_ENV}' mode`)
  } catch (err) {
    fastify.log.error(err)
    throw err
  }
}
start()
