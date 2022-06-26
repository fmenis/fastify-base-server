import fp from 'fastify-plugin'
import massive from 'massive'

async function postgresPlugin(fastify, opts) {
  const config = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
  }

  if (opts?.testMode) {
    config.database = process.env.PG_DB_TEST
  }

  const pg = await massive(config)

  fastify.decorate('pg', pg)

  fastify.onClose(async () => {
    await pg.pgp.end()
  })
}

export default fp(postgresPlugin)
