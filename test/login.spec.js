import t from 'tap'
import { build } from './helpers/helper.js'
import { getUser } from './helpers/dbHelper.js'

t.test('Login API', async t => {
  t.plan(3)

  const fastify = await build(t)
  const user = await getUser(fastify)

  t.test('Should return a jwt providing email and password', async t => {
    const res = await fastify.inject({
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

    t.equal(res.statusCode, 200)
    t.ok(res.body)
    t.match(res.json(), { jwt: res.json().jwt })
  })

  t.test('Should return a jwt providing username and password', async t => {
    const res = await fastify.inject({
      method: 'POST',
      path: 'api/auth/login',
      payload: {
        username: user.username,
        password: 'password',
      },
      headers: {
        'Accept-Version': '1.x',
      },
    })

    t.equal(res.statusCode, 200)
    t.ok(res.body)
    t.match(res.json(), { jwt: res.json().jwt })
  })

  t.test(
    'Should return error if no email and username are provided',
    async t => {
      const res = await fastify.inject({
        method: 'POST',
        path: 'api/auth/login',
        payload: {
          password: 'password',
        },
        headers: {
          'Accept-Version': '1.x',
        },
      })

      t.equal(res.statusCode, 400)
      t.match(res.json(), {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Username and email cannot be both empty',
      })
    }
  )
})
