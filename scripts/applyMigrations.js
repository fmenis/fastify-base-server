import Postgrator from 'postgrator'
import pg from 'pg'
import { join, resolve } from 'path'

export async function applyMigrations(fastify, opts) {
  const { log } = fastify
  const targetDb = opts?.testMode ? process.env.PG_DB_TEST : process.env.PG_DB

  const client = new pg.Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: targetDb,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
  })

  const schema = 'public'

  try {
    await client.connect()

    const postgrator = new Postgrator({
      migrationPattern: join(resolve(), '/migrations/*'),
      driver: 'pg',
      database: targetDb,
      schemaTable: 'migrations',
      currentSchema: schema,
      execQuery: query => client.query(query),
    })

    postgrator.on('migration-started', migration =>
      log.info(
        `Start to execute '${migration.name}' (${migration.action}) migration...`
      )
    )
    postgrator.on('migration-finished', migration =>
      log.info(
        `Migration '${migration.name}' (${migration.action}) successfully applied! \n`
      )
    )

    const results = await postgrator.migrate()

    if (results.length === 0) {
      log.info(
        `No migrations run for schema '${schema}'. Db '${targetDb}' already at the latest version.`
      )
    } else {
      log.info(`${results.length} migration/s applited.`)
    }
  } catch (error) {
    if (error.appliedMigrations) {
      log.error(error.appliedMigrations)
    }

    log.error(error)
  }

  await client.end()
}
