import fp from 'fastify-plugin'

import {
  sNoContent,
  sAccepted,
  sPaginatedInfo,
} from '../common/schema/httpResponse.schema.js'
import {
  sBadRequest,
  sForbidden,
  sUnauthorized,
  sNotFound,
  sConflict,
  sInternalServerError,
} from '../common/schema/httpError.Schema.js'

async function loadSchemas(fastify) {
  fastify.addSchema(sNoContent())
  fastify.addSchema(sAccepted())
  fastify.addSchema(sPaginatedInfo())
  fastify.addSchema(sBadRequest())
  fastify.addSchema(sForbidden())
  fastify.addSchema(sUnauthorized())
  fastify.addSchema(sNotFound())
  fastify.addSchema(sConflict())
  fastify.addSchema(sInternalServerError())
}

export default fp(loadSchemas)
