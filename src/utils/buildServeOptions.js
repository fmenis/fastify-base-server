import { readFileSync } from 'fs'
import { stdTimeFunctions } from 'pino'
import selfCert from 'self-cert'

import { ENV } from '../common/enums.js'

export function buildServerOptions() {
  const serverOptions = {
    logger: {
      level: process.env.LOG_LEVEL,
      timestamp: () => stdTimeFunctions.isoTime(),
      redact: {
        paths: ['password'],
        censor: '**GDPR COMPLIANT**',
      },
    },
    trustProxy: true,
    ajv: {
      customOptions: {
        allErrors: true,
      },
    },
  }

  if (process.env.HTTP2 === 'enabled') {
    serverOptions.http2 = true

    if (process.env.NODE_ENV === ENV.DEVELOPMENT) {
      const certs = selfCert({
        expires: new Date(Date.now() + 86400000),
      })

      serverOptions.https = {
        key: certs.privateKey,
        cert: certs.certificate,
      }
    } else {
      serverOptions.https = {
        key: readFileSync(process.env.SSH_PRIVATE_KEY),
        cert: readFileSync(process.env.SSH_CERTIFICATE),
      }
    }
  }

  return serverOptions
}
