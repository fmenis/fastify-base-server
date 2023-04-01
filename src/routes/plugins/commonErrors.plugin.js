import Fp from 'fastify-plugin'

async function commonErrors(fastify) {
  const { createError } = fastify.httpErrors

  function throwNotFoundError(data) {
    const { name, id } = data
    const message = `Entity ${name} '${id}' not found`
    throw createError(404, message, {
      internalCode: 'NOT_FOUND',
      details: { entityId: id, entityName: name },
    })
  }

  function throwOwnershipError(data) {
    const { id, email } = data
    const message = `Current user isn't the owner of the resource and it hasn't the right permission to performe the action`
    throw createError(403, message, {
      internalCode: 'OWNERSHIP_RESTRICTION',
      details: { entityId: id, userEmail: email },
    })
  }

  fastify.decorate('commonErrors', {
    throwNotFoundError,
    throwOwnershipError,

    errors: [
      {
        code: '*NOT_FOUND*',
        description: 'occurs when the target entity is not present.',
        apis: ['status'],
        statusCode: 404,
      },
      {
        code: '*OWNERSHIP_RESTRICTION*',
        description:
          'occurs when an operation is done on a resource that have a different owner.',
        apis: ['status'],
        statusCode: 403,
      },
    ],
  })
}

export default Fp(commonErrors)
