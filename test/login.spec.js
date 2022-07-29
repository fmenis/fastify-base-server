import t from 'tap'
import { build } from './helpers/helper.js'
import { getUser } from './helpers/dbHelper.js'

t.test('Login API', async t => {
  t.plan(5)

  const fastify = await build(t)
  const user = await getUser(fastify)

  const requestObj = {
    method: 'POST',
    path: 'api/auth/login',
    payload: {},
    headers: {
      'Accept-Version': '1.x',
    },
  }

  t.test('Should return a jwt providing email and password', async t => {
    requestObj.payload = {
      email: user.email,
      password: 'password',
    }

    const res = await fastify.inject(requestObj)

    t.equal(res.statusCode, 200)
    t.ok(res.body)
    t.match(res.json(), { jwt: res.json().jwt })
  })

  t.test('Should return a jwt providing username and password', async t => {
    requestObj.payload = {
      username: user.username,
      password: 'password',
    }

    const res = await fastify.inject(requestObj)

    t.equal(res.statusCode, 200)
    t.ok(res.body)
    t.match(res.json(), { jwt: res.json().jwt })
  })

  t.test(
    'Should return error if no email and username are provided',
    async t => {
      requestObj.payload = {
        password: 'password',
      }

      const res = await fastify.inject(requestObj)

      t.equal(res.statusCode, 400)
      t.match(res.json(), {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Username and email cannot be both empty',
      })
    }
  )

  t.test('Should return error if user is not found', async t => {
    requestObj.payload = {
      username: 'Foo',
      password: 'password',
    }

    const res = await fastify.inject(requestObj)

    t.equal(res.statusCode, 401)
    t.match(res.json(), {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid access: wrong credentials',
    })
  })

  t.test('Should return error if the password does not match', async t => {
    requestObj.payload = {
      username: 'Foo',
      password: 'password',
    }

    const res = await fastify.inject(requestObj)

    t.equal(res.statusCode, 401)
    t.match(res.json(), {
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid access: wrong credentials',
    })
  })
})
