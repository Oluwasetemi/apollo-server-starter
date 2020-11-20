/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
require('dotenv').config({ path: 'variables.env' });
const casual = require('casual');

// import the models
const User = require('../models/user');
const Hra = require('../models/hra');
const Reward = require('../models/reward');
// import helper methods
const { hash } = require('../utils/auth');
const { r, g, b, w, c, m, y, k } = require('../utils/color');
const dbConnection = require('../db');

let dbUrl = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.DATABASE_TEST_URL;
}

async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await User.deleteMany();
  await Reward.deleteMany();
  await Hra.deleteMany();
  console.log(
    `${g('Data Deleted. To load sample data, run\n\n\t npm run seed\n\n')}`
  );
  process.exit();
}

async function seedAdminData() {
  // the main admin
  const adminData = {
    name: 'ChooseLife Admin',
    email: process.env.CHOOSELIFE_ADMIN_EMAIL,
    mobile: '+2348055112244',
    password: await hash('123456'),
    type: 'SUPERADMIN',
    image: 'https://via.placeholder.com/350',
    gender: 'MALE',
    nationality: 'nigeria',
    address: 'A valid address',
    adminVerified: true,
    source: 'EMAIL',
    suspended: false,
    companyName: 'Fitnessfair',
    companyUrl: 'https://chooselife-wellness.com',
    companySize: 10000000,
    hra: [],
    appointments: [],
    exercises: [],
    inBody: [],
    createdAt: '2020-06-15T18:49:12.756Z',
    updatedAt: '2020-06-15T18:49:12.756Z',
  };

  // create data
  const createdAdmin = await User.create(adminData);

  if (createdAdmin) {
    console.log(`${r('Admin created')}`);
  }
}

// create the user.json file from the casual fake data
async function createUserJSON() {
  const user = [];
  const gender = ['MALE', 'FEMALE'];
  const userType = ['INDIVIDUAL', 'EMPLOYEE', 'COMPANY'];

  for (let i = 0; i < 20; i += 1) {
    const obj = {
      name: casual.name,
      email: casual.email,
      mobile: casual.phone,
      password: await hash(casual.password),
      type: i % 3 === 1 ? userType[0] : i % 3 === 2 ? userType[1] : userType[2],
      occupation: casual.title,
      gender: i % 2 === 0 ? gender[0] : gender[1],
      nationality: casual.country,
      dob: casual.date('YYYY-MM-DD'),
      address: casual.address,
      companyName: casual.company_name,
      hra: [],
      appointments: [],
      exercises: [],
      inBody: [],
    };

    user.push(obj);
  }

  return user;
}

async function loadData() {
  try {
    console.log(`${m('Seeding in progress')}`);
    await User.insertMany(await createUserJSON());
    // await Review.insertMany(reviews)
    // await User.insertMany(users)
    await seedAdminData();
    console.log(`${g('👍👍👍👍👍👍👍👍 Done!')}`);
    process.exit();
  } catch (e) {
    console.log(
      `${r(
        '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
      )}`
    );
    console.log(e.message);
    process.exit();
  }
}

// set up seeding for choose life
(async function seedDB() {
  try {
    // db connection
    dbConnection(dbUrl);

    if (process.argv.includes('--delete')) {
      deleteData();
    } else {
      loadData();
    }
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
    process.exit('');
    // throw new Error(error.message);
  }
})();
