# Fastify base server

> Fastity base server (boilerplate).

## Features

- Stateless token based authentication
- Strong API inputs validation and response serialization through [fluen-json-schema](https://github.com/fastify/fluent-json-schema)
- OpenAPI 3.0 documentation by swagger
- API versioning
- Database (postgres) installed by `docker`
- Database access through [massivejs](https://massivejs.org/)
- Automatic application of migrations (through [postgrator](https://github.com/rickbergfalk/postgrator))
- Gracefull shutdown
- Git hooks stuff through [husky](https://typicode.github.io/husky/#/)
- Tuned eslint and prettier configs
- Strong environment variables usage
- E2e test applied to a physic copy of the main db
- PM2 ecosystem files
- centralization of API errors
- [TODO] server dockerization
- structured codebase
- [TODO] TypeScript support

## Requirements

- [nodejs](https://nodejs.org/en/) (>=16.13.x)
- [npm](https://www.npmjs.com/) (>=8.1.0)
- [docker](https://www.docker.com/) (>=20)
- [docker-compose](https://docs.docker.com/compose/) (>=1)

## Setup

1. **Set environments variables**  
   Copy the `.env-example` file and name it `.env`, then set the appropriated values. For details, see _Environment variables_ section.

2. **Inizialize database**  
   Launch the `initDb` script for initialize the postgres instance.

3. **Start server**  
   Start the server with `npm start` script.

## Environment variables

**Bold** env must be requred.

| Name            |      Default       | Description                       |
| --------------- | :----------------: | --------------------------------- |
| **NODE_ENV**    | Nodejs environment |
| SERVER_ADDRESS  |     127.0.0.1      | Server address                    |
| SERVER_PORT     |        3000        | Server port                       |
| LOG_LEVEL       |        info        | Pino.js default log level         |
| ENABLE_BODY_LOG |       false        | Log request body                  |
| SSH_PRIVATE_KEY |                    | SSH private key full path         |
| SSH_CERTIFICATE |                    | SSH certificate key full path     |
| **PG_HOST**     |                    | Postgres host                     |
| **PG_PORT**     |                    | Postgres port                     |
| **PG_DB**       |                    | Postgres database                 |
| **PG_DB_TEST**  |                    | Postgres test database            |
| **PG_USER**     |                    | Postgres user                     |
| **PG_PW**       |                    | Postgres password                 |
| ENABLE_SENTRY   |       false        | Enable sentry integration         |
| SENTRY_DSN      |                    | Secret used to sign the jwt token |

PS: If you have difficulties to compiling the env file, ask the backend guy!

## API usage

### Documentation

If the server is launched with the `npm start` script (development mode), the API documentation can be consulted at `http://{SERVER_ADDRESS}:{SERVER_PORT}/doc`.

### Authentication

The system uses a stateless token based auth system.  
To authenticate the user, the `auth/login` API must be consumed with the right inputs. When this is done, the API returns a jwt token to the client, and that's all.  
The token must be added in every requeset by the user agent inside the `Authorization Bearer` header.

### Api versioning

All the api use the fastify built-in version system.
To consume the api's (and not receive the `Rounte not found error`), add the `Accept-Version` header with the right value: the latter can be found in the swagger api documentation.

## Tests

To launch the e2e test suite, run the `npm test` script.

## Access to containers

Userful commands to directly access to the containers:

- _postgres_ --> `docker container exec -it postgres-fastify /bin/bash`
- _postgres (psql)_ --> `docker container exec -it postgres-fastify psql -U postgres`
