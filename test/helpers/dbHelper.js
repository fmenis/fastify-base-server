export function getUsers(fastify) {
  return fastify.pg.users.find({})
}

export function getUser(fastify) {
  return fastify.pg.users.findOne({})
}
