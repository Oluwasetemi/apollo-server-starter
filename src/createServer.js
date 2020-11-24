/* eslint-disable */
import { altairExpress } from "altair-express-middleware";
import { ApolloServer, PubSub } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import expressPlayground from "graphql-playground-middleware-express";
import { createServer } from "http";
import path from "path";
import remark from "remark";
import html from "remark-html";
import recommended from "remark-preset-lint-recommended";
import report from "vfile-reporter";
import dbConnection from "./db";
import resolvers from "./resolvers";
import typeDefs from './typeDefs';

const defaultQueries = readFileSync(
  path.join(__dirname, "..", "all_development_queries.graphql"),
  "UTF-8"
);

if (!defaultQueries) {
  console.log("Set up your default Queries");
}

async function startServer() {
  try {
    // setup the db
    let dbUrl = process.env.DATABASE_URL;
    if (process.env.NODE_ENV === "test") {
      dbUrl = process.env.DATABASE_TEST_URL;
    }

    if (process.env.NODE_ENV === "development") {
      process.env.FRONTEND_URL = "http://localhost:9998";
    }
    // setup the database
    const db = dbConnection(dbUrl);

    // set up the express app
    const app = express();

    // Send it an object with typeDefs(the schema) and resolvers
    const pubsub = new PubSub();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      context: () => ({ pubsub }),
    });

    let httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);

    // setup middleware using the app
    const corsOptions = {
      credentials: true,
      origin: "*",
      optionsSuccessStatus: 200,
    };

    app.use(cors(corsOptions));

    server.applyMiddleware({ app });

    app.get("/", (req, res) => {
      res.redirect("graphiql");
    });

    app.get("/graphiql", expressPlayground({ endpoint: "/graphql" }));

    // Mount your altair GraphQL client
    app.use(
      "/altair",
      altairExpress({
        endpointURL: "/graphql",
        subscriptionsEndpoint: `ws://localhost:${process.env.PORT || 4000}/graphql`,
        initialQuery: defaultQueries,
      })
    );

    app.get("/changelog", async (req, res) => {
      // read file
      const changeLogString = await readFileSync(
        path.join(__dirname, "..", "changelog.md"),
        "UTF-8"
      );
      // parse the string of the file to html
      remark()
        .use(recommended)
        .use(html)
        .process(changeLogString, function (err, file) {
          console.error(report(err || file));
          // console.log(String(file))
          // output the changelog html
          const htmlFile = String(file);
          return res.send(String(file));
        });
    });

    return { httpServer, server, app };
  } catch (error) {
    console.log(error.stack);
    throw new Error(error.message);
  }
}

export default startServer;
