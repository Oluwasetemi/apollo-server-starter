const { gql } = require('apollo-server-express')

const typeDefs = gql`
	type Greetings {
		name: String
		message: String
	}

	type Query {
		helloWorld: String
	}

	type Mutation {
		greetings(name: String): Greetings
		working: String
	}

	type Subscription {
		newGreetings: Greetings
	}

`

module.exports = typeDefs