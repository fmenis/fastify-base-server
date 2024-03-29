import { stdTimeFunctions } from 'pino'

export function buildServerOptions() {
  const serverOptions = {
    logger: buildLoggerOptions(),
    trustProxy: true,
    ajv: {
      customOptions: {
        allErrors: true,
      },
    },
  }

  return serverOptions
}

function buildLoggerOptions() {
  const localTargets = [
    {
      target: 'pino-pretty',
      level: process.env.LOG_LEVEL,
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid, hostname',
      },
    },
  ]

  const liveTargets = [
    {
      target: 'pino/file',
      level: process.env.LOG_LEVEL,
      options: {
        destination: 1, // STDOUT
      },
    },
    {
      target: 'pino-sentry-transport',
      options: {
        sentry: {
          dsn: process.env.SENTRY_DSN,
          environment: process.env.NODE_ENV,
        },
        withLogRecord: true,
        tags: ['id'],
        context: ['hostname'],
        minLevel: 30, // warn
      },
    },
  ]

  return {
    level: process.env.LOG_LEVEL,
    timestamp: () => stdTimeFunctions.isoTime(),
    redact: {
      paths: [
        'password',
        'oldPassword',
        'newPassword',
        'newPasswordConfirmation',
      ],
      censor: '**GDPR COMPLIANT**',
    },
    // Unfortunately, these configurations not available when working with transports
    // formatters: {
    //   level(label) {
    //     return { level: label }
    //   },
    //   bindings() {
    //     return { pid: undefined, hostname: undefined }
    //   },
    // },
    transport: {
      targets: process.env.NODE_ENV === 'local' ? localTargets : liveTargets,
    },
  }
}
