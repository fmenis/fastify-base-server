import S from 'fluent-json-schema'
import { ENV } from '../enums.js'

export function sEnv() {
  return S.object()
    .prop(
      'NODE_ENV',
      S.string().enum([ENV.DEVELOPMENT, ENV.STAGING, ENV.PRODUCTION]).required()
    )
    .prop('SERVER_ADDRESS', S.string().default('127.0.0.1'))
    .prop('SERVER_PORT', S.string().default('3000'))
    .prop(
      'LOG_LEVEL',
      S.string()
        .enum(['debug', 'info', 'warn', 'error', 'fatal'])
        .default('info')
    )
    .prop('HTTP2', S.string().enum(['enabled', 'disabled']).default('disabled'))
    .valueOf()
}
