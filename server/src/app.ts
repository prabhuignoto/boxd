import BodyParser from "body-parser";
import ConnectRedis from "connect-redis";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import graphqlHTTP from "express-graphql";
import Session from "express-session";
import { buildSchema } from "graphql";
import morgan from "morgan";
import Redis from "redis";
// import getAccount from "./resolvers/account";
import Routers from "./router";
// import schema from "./typedefs/account";
import schema from "./schema";
import {createLogger, transports} from "winston";
import cors from "cors";

// initialize redis store and client
const RedisStore = ConnectRedis(Session);
const RedisClient = Redis.createClient();
const ErrorLogger = createLogger({
  level: "error",
  transports: [new transports.Console()]
})

// initialize express
const app = express();

// load dotenv config on dev env
if (process.env.NODE_ENV === "development") {
  config();
}

try {
  // use middleware
// morgan middleware for logging
app.use(morgan(process.env.MORGAN_LOG_MODE as string));
app.use(BodyParser());
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
}))
// setup express-session and hook up with redis store
app.use(
  Session({
    cookie: {
      expires: false,
      maxAge: Number(process.env.SESSION_COOKIE_MAXAGE),
      secure: false,
    },
    resave: false,
    saveUninitialized: true,
    secret: "vubox app secret",
    store: new RedisStore({
      client: RedisClient,
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT),
    })
  })
);

// setup app wide routers
app.use("/", Routers);
app.use(
  "/graphql",
  graphqlHTTP((request: Request, response: Response) => {
    const session = request.session;
    if (session && session.logged_in) {
      return {
        graphiql: true,
        schema,
        catch: (error: any)  => {
          console.log(error)
        }
      };
    } else {
      return {
        graphiql: true,
        rootValue: null,
        schema: buildSchema("{}")
      };
    }
  })
);

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready`));

} catch (error) {
  ErrorLogger.log(error);
}
