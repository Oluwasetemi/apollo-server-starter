/* eslint-disable */
const { ApolloServer, PubSub } = require('apollo-server-express');
const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { readFileSync } = require('fs');
const { createServer } = require('http');
const path = require('path');

const typeDefs = readFileSync(path.join(__dirname, 'typeDefs.graphql'), 'UTF-8');
if (!typeDefs) {
  console.log('Set up your typeDefs')
  return;
}
const Mutation = require('./resolvers/mutation');
const Query = require('./resolvers/query');
const Subscription = require('./resolvers/subscription');


async function startServer() {

  // setup the db

    // set up the express app
    const app = express();

    // Send it an object with typeDefs(the schema) and resolvers
    const pubsub = new PubSub();
    const server = new ApolloServer({
      typeDefs,
      resolvers: {
        Query,
        Mutation,
        Subscription
      },
      introspection: true,
      context: () => ({ pubsub })
    });

    server.applyMiddleware({ app });

    app.get('/', (req, res) => {
        res.redirect('\graphiql')
    });

    app.get('/graphiql', expressPlayground({ endpoint: '/graphql' }));


    httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);

    return {httpServer, server, app}
}

// exports.httpServer = httpServer;
module.exports = startServer;
