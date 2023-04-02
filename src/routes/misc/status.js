import S from 'fluent-json-schema'

import { buildRouteFullDescription } from '../common/routeUtils.js'
import { getServerVersion } from '../common/utils.js'

export default async function status(fastify) {
  const { errors } = fastify.commonErrors
  const version = getServerVersion()

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
        errors,
        api: 'status',
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
