const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  return seed(devData).then(() => db.end())
  .then((data)=>{
    console.log('Completed Seeding the table')
  })
  .catch((err)=>{
    console.log(err)
  })
};

runSeed();
