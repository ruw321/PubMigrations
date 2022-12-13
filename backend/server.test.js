// import config file
const config = require('./config.json')

// http://knexjs.org/#Installation-client for MySQL connection
// const knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host : config.rds_host,
//     port : config.rds_port,
//     user : config.rds_user,
//     password : config.rds_password,
//     database : 'researchers_test'
//   }
// });

const dbLib = require('./routes');

let db;
const request = require('supertest');
const webapp = require('./server');

//only using get requests so no need to clear database after
// each test

// beforeAll(async () =>{
//   db = await dbLib.connection();
// });

describe('Simple test', () => {
    test('status code and response missing points', async () => {
       const response = await request(webapp).get('/migration');
       expect(response.status).toEqual(200);
    });
});
