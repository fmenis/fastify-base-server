import t from 'tap'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import { config } from 'dotenv'
config()

// import { build } from './helpers/testHelper.js'

const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))

import Fastify from 'fastify'
import { buildServerOptions } from '../src/utils/buildServeOptions.js'
import App from '../src/app.js'

t.test('Status API', async t => {
  t.plan(2)

  const fastify = Fastify(buildServerOptions())
  await fastify.register(App)

  t.teardown(() => {
    fastify.close()
  })

  console.log(fastify.pg)
  console.log(fastify.bcrypt)
  console.log(fastify.httpErrors)

  const statusRes = await fastify.inject({
    method: 'GET',
    path: 'api/status',
  })

  t.equal(statusRes.statusCode, 200)
  t.match(statusRes.json(), { status: 'ok', version })
})
