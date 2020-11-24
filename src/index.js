import createServer from "./createServer";

(async () => {
  try {
    const { httpServer, server } = await createServer();

    httpServer.listen(
      {
        port: process.env.PORT || 4000,
      },
      () =>
        /* eslint-disable */
        console.log(
          `GraphQL Server running at http://localhost:${process.env.PORT}${server.graphqlPath} and socket is running at ws://localhost:${process.env.PORT}${server.graphqlPath}`
        )
      /* eslint-enable */
    );
  } catch (error) {
    console.error(error.stack);
    console.log(error.message);
  }
})();
