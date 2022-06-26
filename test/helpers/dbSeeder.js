export async function seedDb(fastify) {
  const { pg } = fastify

  //TODO!!!
  console.log('-------------------', fastify.pg)

  const res = await pg.insert({
    firstname: 'Alice',
    lastname: 'Spring',
    username: 'ali',
    password: 'prova',
  })

  console.log(res)
}
