export async function seedDb(fastify) {
  await populateUsers(fastify)
}

export async function resetDb(fastify) {
  await deleteUsers(fastify)
}

function populateUsers(fastify) {
  return fastify.pg.users.insert({
    firstname: 'Alice',
    lastname: 'Spring',
    username: 'alispring',
    password: '$2a$10$ZR2sHP9KuYxykbHLCO/7/eDzu7ja.lRusRqErALC2/C.3wUqwTDTO',
    email: 'test@gmdail.com',
  })
}

function deleteUsers(fastify) {
  return fastify.pg.users.destroy({})
}
