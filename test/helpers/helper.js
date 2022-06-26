import Fastify from 'fastify'
import { buildServerOptions } from '../../src/utils/buildServeOptions.js'
import App from '../../src/app.js'
// import { seedDb } from './dbSeeder.js'

export async function build(t) {
  const fastify = Fastify(buildServerOptions())

  fastify.register(App, { testMode: true })

  // await seedDb(fastify)

  t.teardown(() => {
    fastify.close()
  })

  return fastify
}
