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

jest.setTimeout(10 * 10000);

//only using get requests so no need to clear database after
// each test

// beforeAll(async () =>{
//   db = await dbLib.connection();
// });

describe('testing get requests', () => {
    test('testing migration', async () => {
       const response = await request(webapp).get('/migration');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('HasPhd',0);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing migration query params', async () => {
       const response = await request(webapp).get('/migration?PhdYear=2000&EarliestYear=2000&HasPhd=1');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('HasPhd',1);
	console.log(JSON.parse(response.text).results[0]);
    });

    test('testing filter paper words', async () => {
       const response = await request(webapp).get('/paper/words?words=brain,neurology');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('PMID',489746);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing filter paper publication', async () => {
       const response = await request(webapp).get('/paper/publications?PubYear=1975&PMID=1');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('PMID',1);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing top researcher', async () => {
       const response = await request(webapp).get('/researchers/top?Organization=Tsinghua%20University');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('NumPapers',1);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing top researcher no organization', async () => {
       const response = await request(webapp).get('/researchers/top');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text)).toHaveProperty('error','Organization is not specified');
	// console.log(JSON.parse(response.text).results[0]);
    });

    test('testing bio education by country', async () => {
       const response = await request(webapp).get('/topBioEdByCountry?country=US');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Count',657);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing top institute by country', async () => {
       const response = await request(webapp).get('/topInstituteByCountry?Country=US');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('NumPapers',320);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing total paper by country', async () => {
       const response = await request(webapp).get('/paper/totalbycountry');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Country',"GP");
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing countries', async () => {
       const response = await request(webapp).get('/countries');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Name',"Unknown");
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing visual data', async () => {
       const response = await request(webapp).get('/visualdata');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('ANDID',4970212);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing organizations', async () => {
       const response = await request(webapp).get('/organizations');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Organization',"Yeshiva University Albert Einstein College of Medicine");
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing papers moved between two countries', async () => {
       const response = await request(webapp).get('/twocountries/papersmoved');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('count',0);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing bio entities moved between two countries', async () => {
       const response = await request(webapp).get('/twocountries/bioentitiesmoved?country1=US&country2=IT');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Count',11);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing movement', async () => {
       const response = await request(webapp).get('/twocountries/movement');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Count',0);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing shared bio entities', async () => {
       const response = await request(webapp).get('/twocountries/sharedbioentities?country1=US&country2=IN');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Count',675);
	console.log(JSON.parse(response.text).results[0]);
    });
    // test('testing papers both', async () => {
    //    const response = await request(webapp).get('/twocountries/papersboth?country1=US&country2=IN');
    // 	expect(response.status).toEqual(200);
    // 	expect(JSON.parse(response.text).results[0]).toHaveProperty('PMID',151666);
    // 	console.log(JSON.parse(response.text).results[0]);
    // });

    test('testing most benefitted org', async () => {
       const response = await request(webapp).get('/mostBenefitedOrg');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Organization',"Perdana University");
	console.log(JSON.parse(response.text).results[0]);
    });

});
