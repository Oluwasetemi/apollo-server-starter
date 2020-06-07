// all the mutation
const mutation = {
  greetings(parent, { name = 'Setemi' }, { pubsub }) {
    const data = {
      name,
      message: 'Welcome to GraphQL'
    };
    // publish the result
    pubsub.publish('new-greetings', { newGreetings: data });
    return data;
  },
  working() {
    return 'working';
  }
};

module.exports = mutation;
