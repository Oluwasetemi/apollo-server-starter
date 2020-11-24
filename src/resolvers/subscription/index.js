// all the subscription
const subscription = {
  newGreetings: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator('new-greetings')
  }
};

export default subscription;
