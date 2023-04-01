import S from 'fluent-json-schema'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'

import { buildRouteFullDescription } from '../utils/routeUtils.js'

const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))

export default async function status(fastify) {
  fastify.route({
    method: 'GET',
    path: '/status',
    config: {
      public: false,
    },
    schema: {
      summary: 'Server status',
      description: buildRouteFullDescription({
        description: 'Returns status and version of the server.',
      }),
      response: {
        200: S.object()
          .description('Status response.')
          .prop('status', S.string())
          .description('Status.')
          .prop('version', S.string())
          .description('Server version.'),
      },
    },
    handler: onStatus,
  })

  async function onStatus() {
    return { status: 'ok', version }
  }
}
