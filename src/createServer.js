/* eslint-disable */
const { ApolloServer, PubSub } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
const { readFileSync } = require("fs");
const { createServer } = require("http");
const path = require("path");
const dbConnection = require("./db");
const remark = require("remark");
const recommended = require("remark-preset-lint-recommended");
const html = require("remark-html");
const report = require("vfile-reporter");
const { altairExpress } = require("altair-express-middleware");
const cors = require("cors");

const resolvers = require("./resolvers");

const typeDefs = readFileSync(
  path.join(__dirname, "typeDefs.graphql"),
  "UTF-8"
);
if (!typeDefs) {
  console.log("Set up your typeDefs");
  return;
}

const defaultQueries = readFileSync(
  path.join(__dirname, "..", "all_development_queries.graphql"),
  "UTF-8"
);

if (!defaultQueries) {
  console.log("Set up your default Queries");
  return;
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

    httpServer = createServer(app);
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

module.exports = startServer;
