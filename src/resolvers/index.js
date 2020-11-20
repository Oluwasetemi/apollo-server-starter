const Mutation = require("./mutation");
const Query = require("./query");
const Subscription = require("./subscription");

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

module.exports = resolvers;
