/* eslint-disable no-unused-vars */
import { ApolloServer } from 'apollo-server-fastify';
import { config } from 'dotenv';
import fastify, { FastifyRequest } from 'fastify';
import fastifyCompress from 'fastify-compress';
import fastifyCookie from 'fastify-cookie';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyMulter from 'fastify-multer';
import fastifySession from 'fastify-session';
import Redis from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { Authenticate, Authorize, isUserLoggedIn, RevokeToken } from './modules/auth';
import Download from './modules/download';
import { ErrorLogger } from './modules/logger';
import Logout from './modules/logout';
import AccountResolver from './resolvers/account-new';
import BulkResolver from './resolvers/bulk-new';
import FolderResolver from './resolvers/folder-new';
import Upload from './modules/upload';

config();

const MulterUpload = fastifyMulter({ dest: 'uploads/' });

// * initialize redis store
// tslint:disable-next-line:no-var-requires
const RedisStore = require('connect-redis')(fastifySession);

// * setup redis client options
let RedisOptions: Redis.ClientOpts = {
  connect_timeout: 6000,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  retry_strategy: (options: any) => {
    if (options.error) {
      throw new Error('Failed to connect to the redis host');
    }
    return 3000;
  },
  no_ready_check: true
};

// * add redis password for production
if (process.env.NODE_ENV === 'prod') {
  RedisOptions = Object.assign({}, RedisOptions, {
    password: process.env.REDIS_PASSWORD
  });
}

// * create redis client
const RedisClient = Redis.createClient(RedisOptions);

// * create fastify
const fast = fastify({
  logger: true
});

// * setup fastify session
fast.register(fastifyCookie);
fast.register(fastifySession, {
  secret: process.env.SESSION_SECRET as string,
  saveUninitialized: true,
  cookie: {
    maxAge: Number(process.env.SESSION_COOKIE_MAXAGE),
    secure: false
  },
  store: new RedisStore({
    client: RedisClient,
    logErrors: true,
    ttl: 5
  })
});

// * setup fastify routes
fast.route({
  method: "POST",
  url: "/upload",
  preHandler: MulterUpload.array("files", 20),
  handler: Upload
});

fast.get('/auth/login', Authorize);
fast.get('/auth/authenticate', Authenticate);
fast.get('/revokeAccess', RevokeToken);
fast.get('/isLoggedIn', isUserLoggedIn);
fast.get('/download', Download);

fast.post('/logout', Logout);

(async function () {
  try {

    // * build the graphql schema
    const schema = await buildSchema({
      resolvers: [AccountResolver, FolderResolver, BulkResolver]
    });

    // * initiate apollo server.
    const apolloServer = new ApolloServer({
      context: (req: FastifyRequest) => {
        return {
          session: {
            access_token: req.session.access_token,
            account_id: req.session.account_id
          },
          playground: true,
          schema,
        };
      },
      schema,
    });

    // * register apollo server
    fast.register(apolloServer.createHandler({
      cors: {
        credentials: false,
        origin: process.env.CORS,
      },
      disableHealthCheck: true
    }));

    // * register fastify libs
    fast.register(fastifyCompress);
    fast.register(fastifyCors, {
      exposedHeaders: 'Content-Disposition',
      origin: process.env.CORS,
      credentials: true,
      methods: ['GET', 'POST'],
    });
    fast.register(fastifyHelmet);
    fast.register(fastifyMulter.contentParser);

    // * start the server
    fast.listen(4000);
    fast.log.info('server running on 4000');
  } catch (error) {
    ErrorLogger.log({
      level: 'error',
      message: error
    });
    fast.log.error(error);
  }
}());
