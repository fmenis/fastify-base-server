import S from 'fluent-json-schema'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'

const { version: serverVersion } = JSON.parse(
  readFileSync(join(resolve(), 'package.json'))
)

export default async function status(fastify) {
  const version = '1.0.0'

  fastify.route({
    method: 'GET',
    path: '/status',
    constraints: { version },
    config: {
      public: false,
    },
    schema: {
      summary: 'Get application status and version',
      description: `Returns status and version of the server (version ${version})`,
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
    return { status: 'ok', version: serverVersion }
  }
}
