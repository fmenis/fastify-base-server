import { config } from 'dotenv'
config()

import Fastify from 'fastify'
import { buildServerOptions } from '../../src/utils/buildServeOptions.js'
import App from '../../src/app.js'
import { seedDb, resetDb } from './dbSeeder.js'

export async function build(t) {
  const fastify = Fastify({
    ...buildServerOptions(),
    logger: { ...buildServerOptions().logger, level: 'error' },
  })

  await fastify.register(App, { testMode: true })
  await fastify.ready()

  await seedDb(fastify)

  t.teardown(async () => {
    await resetDb(fastify)
    fastify.close()
  })

  return fastify
}
