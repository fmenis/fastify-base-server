import { readFileSync } from 'fs'
import { stdTimeFunctions } from 'pino'
import selfCert from 'self-cert'

import { ENV } from '../routes/common/enum.js'

/**
 * ##TODO
 * - migliorare settings logging
 * - testare http2
 */

export function buildServerOptions() {
  const serverOptions = {
    logger: {
      level: process.env.LOG_LEVEL,
      timestamp: () => stdTimeFunctions.isoTime(),
      formatters: {
        level(label) {
          return { level: label }
        },
        bindings() {
          return { pid: undefined, hostname: undefined }
        },
      },
      redact: {
        paths: [
          'password',
          'oldPassword',
          'newPassword',
          'newPasswordConfirmation',
        ],
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

  if (process.env.ENABLE_HTTP2 === 'enabled') {
    serverOptions.ENABLE_HTTP2 = true

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
