// all the subscription
const subscription = {
  newGreetings: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator('new-greetings')
  }
};

module.exports = subscription;
