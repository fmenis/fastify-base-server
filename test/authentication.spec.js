import t from 'tap'
import { build } from './helpers/helper.js'
import { getUser } from './helpers/dbHelper.js'

t.test('Authentication flow', async t => {
  t.plan(4)

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
      'Accept-Version': '1.x',
    },
  })

  const jwt = loginRes.json().jwt

  const requestObj = {
    method: 'GET',
    path: 'api/status',
    payload: {},
    headers: {
      'Accept-Version': '1.x',
    },
  }

  t.test(
    `Should throw error if 'Authorization' header is not provided`,
    async t => {
      const res = await fastify.inject(requestObj)

      t.equal(res.statusCode, 401)
      t.match(res.json(), {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid access',
      })
    }
  )

  t.test(
    `Should throw error if 'Authorization' header is wrong formatted (missing Bearer)`,
    async t => {
      requestObj.headers = {
        ...requestObj.headers,
        Authorization: 'Foo Bar',
      }

      const res = await fastify.inject(requestObj)

      t.equal(res.statusCode, 401)
      t.match(res.json(), {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid access',
      })
    }
  )

  t.test(
    `Should throw error if 'Authorization' header is wrong formatted (missing raw jwt)`,
    async t => {
      requestObj.headers = {
        ...requestObj.headers,
        Authorization: 'Bearer',
      }

      const res = await fastify.inject(requestObj)

      t.equal(res.statusCode, 401)
      t.match(res.json(), {
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid access',
      })
    }
  )

  t.test(`Should throw error if the jwt is malformed`, async t => {
    const malformedJwt = jwt.slice(1)
    // const malformedJwt = jwt

    requestObj.headers = {
      ...requestObj.headers,
      Authorization: `Bearer ${malformedJwt}`,
    }

    const res = await fastify.inject(requestObj)

    t.equal(res.statusCode, 401)
    t.match(res.json(), {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid access',
    })
  })
})
