import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import fp from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { ENV } from '../utils/enum.js'

const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))

async function swaggerGenerator(fastify) {
  await fastify.register(fastifySwagger, {
    mode: 'dynamic',
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
          description: 'Local api',
          env: ENV.LOCAL,
        },
      ].reduce((acc, item) => {
        if (item.env === process.env.NODE_ENV) {
          acc.push({
            url: item.url,
            description: item.description,
          })
        }
        return acc
      }, []),
      tags: [
        { name: 'auth', description: 'Auth related end-points' },
        { name: 'misc', description: 'Miscellaneous related end-points' },
      ].sort((a, b) => a.name.localeCompare(b.name)),
    },
  })

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/doc',
    initOAuth: {},
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      //##TODO https://github.com/fastify/fastify-swagger-ui#protect-your-documentation-routes
      preHandler: function (request, reply, next) {
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: header => header,
  })
}

export default fp(swaggerGenerator)
