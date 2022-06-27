import t from 'tap'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import { build } from './helpers/helper.js'

const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))

t.test('Status API', async t => {
  t.plan(2)

  const fastify = await build(t)

  const statusRes = await fastify.inject({
    method: 'GET',
    path: 'api/status',
  })

  t.equal(statusRes.statusCode, 200)
  t.match(statusRes.json(), { status: 'ok', version })
})
