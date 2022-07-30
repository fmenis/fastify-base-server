import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import fp from 'fastify-plugin'
import Swagger from '@fastify/swagger'

const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))

async function swaggerGenerator(fastify) {
  fastify.register(Swagger, {
    routePrefix: '/doc',
    openapi: {
      info: {
        title: 'Fastify base server',
        description: 'Fastify base server documentation',
        version,
        contact: {
          name: 'API Support',
          email: 'filippomeniswork@gmail.com',
        },
      },
      externalDocs: {
        url: 'https://github.com/fmenis/fastify-base-server',
        description: 'Find more info here',
      },
      servers: [
        {
          url: `http://localhost:${process.env.SERVER_PORT}`,
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'auth', description: 'Auth related end-points' },
        { name: 'misc', description: 'Miscellaneous related end-points' },
      ],
    },
    exposeRoute: true,
  })
}

export default fp(swaggerGenerator)
