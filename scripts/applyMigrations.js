import Postgrator from 'postgrator'
import pg from 'pg'
import { join, resolve } from 'path'

async function main() {
  const client = new pg.Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PW,
  })

  const schema = 'public'

  try {
    await client.connect()

    const postgrator = new Postgrator({
      migrationPattern: join(resolve(), '/migrations/*'),
      driver: 'pg',
      database: process.env.PG_DB,
      schemaTable: 'migrations',
      currentSchema: schema,
      execQuery: query => client.query(query),
    })

    postgrator.on('migration-started', migration =>
      console.log(
        `Start to execute "${migration.name}" (${migration.action}) migration...`
      )
    )
    postgrator.on('migration-finished', migration =>
      console.log(
        `Migration "${migration.name}" (${migration.action}) successfully applied! \n`
      )
    )

    const results = await postgrator.migrate()

    if (results.length === 0) {
      console.log(
        `No migrations run for schema "${schema}". Db already at the latest version.`
      )
    } else {
      console.log(`${results.length} migration/s applited.`)
    }
  } catch (error) {
    if (error.appliedMigrations) {
      console.error(error.appliedMigrations)
    } else {
      console.log(error)
    }
  }

  await client.end()
}

main()
