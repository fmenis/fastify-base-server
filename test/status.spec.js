import t from 'tap'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import { build } from './helpers/helper.js'
import { getUser } from './helpers/dbHelper.js'

const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))

t.test('Status API', async t => {
  t.plan(2)

  const fastify = await build(t)
  const user = await getUser(fastify)

  const loginRes = await fastify.inject({
    method: 'POST',
    path: 'api/auth/login',
    payload: {
      email: user.email,
      password: 'password',
    },
    headers: {
      'Accept-Version': '1.0.0',
    },
  })

  const statusRes = await fastify.inject({
    method: 'GET',
    path: 'api/status',
    headers: {
      Authorization: `Bearer ${loginRes.json().jwt}`,
      'Accept-Version': '1.0.0',
    },
  })

  t.equal(statusRes.statusCode, 200)
  t.match(statusRes.json(), { status: 'ok', version })
})
