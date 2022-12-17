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
	expect(JSON.parse(response.text).results[0]).toHaveProperty('HasPhd',1);
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
	expect(JSON.parse(response.text).results[0]).toHaveProperty('PMID',563535);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing filter paper words no query params', async () => {
       const response = await request(webapp).get('/paper/words');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text)).toHaveProperty('error','search query is empty');
    });

    test('testing filter paper publication', async () => {
       const response = await request(webapp).get('/paper/publications?PubYear=1975&PMID=21');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('PMID',21);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing top researcher', async () => {
       const response = await request(webapp).get('/researchers/top?Organization=Tsinghua%20University');
	expect(response.status).toEqual(200);
	// expect(JSON.parse(response.text).results[0]).toHaveProperty('NumPapers',1);
	// console.log(JSON.parse(response.text).results[0]);
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
    test('testing bio education by country with limit', async () => {
       const response = await request(webapp).get('/topBioEdByCountry?countries=US&limit=10');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results).toHaveLength(10);
	console.log(JSON.parse(response.text).results[0]);
    });

    test('testing top institute by country', async () => {
       const response = await request(webapp).get('/topInstituteByCountry?Country=US');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('NumPapers',320);
	console.log(JSON.parse(response.text).results[0]);
    });

    test('testing total paper by country', async () => {
       const response = await request(webapp).get('/paper/totalbycountry?country=US');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('NumPapers',12286);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing countries', async () => {
       const response = await request(webapp).get('/countries');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Name',"Andorra");
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing visual data', async () => {
       const response = await request(webapp).get('/visualdata');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('ANDID',2224679);
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
	const response = await request(webapp).get('/twocountries/bioentitiesmoved?country1=US&country2=CN');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('Count',2);
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
    test('testing get best authors with limit', async () => {
       const response = await request(webapp).get('/getBestAuthors?limit=1');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('count',2384);
	console.log(JSON.parse(response.text).results[0]);
    });
    test('testing most employed cities', async () => {
       const response = await request(webapp).get('/mostEmployedCities?country=US');
	expect(response.status).toEqual(200);
	expect(JSON.parse(response.text).results[0]).toHaveProperty('count',6272);
	console.log(JSON.parse(response.text).results[0]);
    });

    test('testing papers both', async () => {
       const response = await request(webapp).get('/twocountries/papersboth?country1=US&country2=IN');
    	expect(response.status).toEqual(200);
    	expect(JSON.parse(response.text).results[0]).toHaveProperty('PMID',1330);
    	console.log(JSON.parse(response.text).results[0]);
    });

    test('testing most benefitted org with range', async () => {
       const response = await request(webapp).get('/mostBenefitedOrg?min=0&max=0.4');
    	expect(response.status).toEqual(200);
    	expect(JSON.parse(response.text).results[0]).toHaveProperty('Organization',"Université Grenoble Alpes");
    	console.log(JSON.parse(response.text).results[0]);
    });

    test('testing filter researchers', async () => {
       const response = await request(webapp).get('/filterResearchers?employment=Harvard&education=Harvard');
    	expect(response.status).toEqual(200);
    	expect(JSON.parse(response.text).results[0]).toHaveProperty('ANDID',284506);
    	console.log(JSON.parse(response.text).results[0]);
    });

});
