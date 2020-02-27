// import "newrelic";

import { ApolloServer } from "apollo-server-express";
import BodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import Session from "express-session";
import { createServer } from "http";
import morgan from "morgan";
import Redis from "redis";
import { createLogger, transports } from "winston";
import Routers from "./router";
import schema from "./schema";

// * initialize redis store and client
// tslint:disable-next-line:no-var-requires
const RedisStore = require("connect-redis")(Session);
const RedisClient = Redis.createClient({
  connect_timeout: 6000,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  retry_strategy: (options: any) => {
    if (options.error) {
      throw new Error("Failed to connect to the redis host");
    }
    return 3000;
  },
});

// RedisClient.auth(process.env.REDIS_PASSWD || "");

// * create error logger
const ErrorLogger = createLogger({
  level: "error",
  transports: [new transports.Console()],
});

// * initialize express
const app = express();

// * load dotenv config on dev env
if (process.env.NODE_ENV === "development") {
  config();
}

try {
  // * enable morgan logger
  app.use(morgan(process.env.MORGAN_LOG_MODE as string));

  // * invoke body parser
  app.use(BodyParser());

  // * setup express-session and hook up with redis store for storing the sessions
  app.use(
    Session({
      cookie: {
        // expires: false,
        maxAge: Number(process.env.SESSION_COOKIE_MAXAGE),
        secure: false,
      },
      resave: false,
      saveUninitialized: true,
      secret: "vubox app secret",
      store: new RedisStore({
        client: RedisClient,
      }),
    }),
  );

  // * initiate apollo server.
  const server = new ApolloServer({
    context: ({
      req,
      resp,
      connection,
    }: {
      req: Request;
      resp: Response;
      connection: any;
    }) => {
      if (connection) {
        return {};
      } else {
        return {
          session: {
            access_token: req.session && req.session.access_token,
            account_id: req.session && req.session.account_id,
          },
        };
      }
    },
    playground: true,
    schema,
  });

  // * apply the apollo server middleware to the existing express app.
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: process.env.CORS,
    },
    path: "/graphql",
  });

  // * setup cross origin policy
  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS,
    }),
  );

  // * setup app wide routers
  app.use("/", Routers);

  // * start the app server
  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`🚀 Server ready`),
  );
} catch (error) {
  ErrorLogger.log(error);
}
