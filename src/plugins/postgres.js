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
    config.host = process.env.PG_HOST_TEST
    config.port = process.env.PG_PORT_TEST
    config.database = process.env.PG_DB_TEST
    config.user = process.env.PG_USER_TEST
    config.password = process.env.PG_PW_TEST
  }

  const db = await massive(config)

  fastify.decorate('db', db)

  fastify.onClose(async () => {
    await db.pgp.end()
  })
}

export default fp(postgresPlugin)
