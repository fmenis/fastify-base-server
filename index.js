import Fastify from "fastify";

const fastify = Fastify({
  logger: {
    level: "info",
  },
});

const port = 3000;
const host = "0.0.0.0";

fastify.listen({ port, host }, (err, address) => {
  const { log } = fastify;

  if (err) {
    log.error(err);
    process.exit(1);
  }

  log.info(`Server running in ${process.env.NODE_ENV} mode.`);
});
