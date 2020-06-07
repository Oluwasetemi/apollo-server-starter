const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const cors = require('cors');
const createServer = require('./createServer');
const db = require('./db');

(async () => {
  const { httpServer, server, app } = await createServer();

  // setup middleware using the app
  const corsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));

  httpServer.listen(
    {
      port: process.env.PORT || 4000
    },
    () =>
      console.log(
        `GraphQL Server running at http://localhost:4000${server.graphqlPath} and socket is running at ws://localhost:4000/graphql`
      )
  );
})();
