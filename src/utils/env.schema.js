import S from 'fluent-json-schema'
import { ENV } from '../routes/common/enum.js'

export function sEnv() {
  return S.object()
    .prop(
      'NODE_ENV',
      S.string()
        .enum([ENV.LOCAL, ENV.DEVELOPMENT, ENV.STAGING, ENV.PRODUCTION])
        .required()
    )
    .prop('SERVER_ADDRESS', S.string().default('127.0.0.1'))
    .prop('SERVER_PORT', S.string().default('3000'))
    .prop(
      'LOG_LEVEL',
      S.string()
        .enum(['debug', 'info', 'warn', 'error', 'fatal'])
        .default('info')
    )
    .prop('ENABLE_BODY_LOG', S.boolean().default(false))
    .prop('ENABLE_HTTP2', S.boolean().default(false))
    .prop('PG_HOST', S.string().required())
    .prop('PG_PORT', S.string().required())
    .prop('PG_DB', S.string().required())
    .prop('PG_DB_TEST', S.string().required())
    .prop('PG_USER', S.string().required())
    .prop('PG_PW', S.string().required())
    .prop('ENABLE_SENTRY', S.boolean())
    .default(false)
    .valueOf()
}
