import fp from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { ENV } from '../common/enum.js'
import { getServerVersion } from '../common/utils.js'

async function swaggerGenerator(fastify) {
  const version = getServerVersion()

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
          url: `http://localhost:${fastify.config.SERVER_PORT}`,
          description: 'Local api',
          env: ENV.LOCAL,
        },
      ].reduce((acc, item) => {
        if (item.env === fastify.config.NODE_ENV) {
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

  if (fastify.config.NODE_ENV !== ENV.PRODUCTION) {
    await fastify.register(fastifySwaggerUi, {
      //##TODO studiare configurazioni
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
        preHandler: function (request, reply, next) {
          next()
        },
      },
      staticCSP: true,
      transformStaticCSP: header => header,
    })
  }
}

export default fp(swaggerGenerator)
