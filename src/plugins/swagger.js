import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import fp from 'fastify-plugin'
import Swagger from '@fastify/swagger'

const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))

async function swaggerGenerator(fastify) {
  // TODO passare a openApi v3
  fastify.register(Swagger, {
    routePrefix: '/doc',
    swagger: {
      info: {
        title: 'Fastify base server',
        description: 'Fastify base server documentation',
        version,
      },
      externalDocs: {
        url: 'https://github.com/fmenis/fastify-base-server',
        description: 'Find more info here',
      },
      host: `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`,
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{ name: 'misc', description: 'Miscellaneous related end-points' }],
    },
    exposeRoute: true,
  })
}

export default fp(swaggerGenerator)
