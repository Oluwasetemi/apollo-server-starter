/* eslint-disable no-console */
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

// const mongooseErrorHandler = require('mongoose-mongodb-errors');

// A plugin to transform mongodb like errors (E.G. "11000 - duplicate key") into Mongoose ValidationError instances
// mongoose.plugin(mongooseErrorHandler);

// check if the uri of the database was setup in the env variable
if (!process.env.DATABASE_URL) {
  console.warn('Please setup your DATABASE variable');
  throw new Error('setup a database variable');
}
// check if the uri of the database was setup in the env variable
if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_TEST_URL) {
  console.warn('Please setup your TEST DATABASE variable');
  throw Error('setup a database test variable');
}

// Connecting to the database
const connection = async (url) => {
  try {
    const con = await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    const db = con.connection;

    // console.log(db);
    console.info('INFO - Successfully connected to the database');
    return db;
  } catch (error) {
    console.log(error.message);
    throw new Error('FIX - Could not connect to the database. Exiting now...');
  }
};

export default connection;
