import miscRoutes from './misc/index.js'

export default async function index(fastify) {
  fastify.register(miscRoutes)
}
