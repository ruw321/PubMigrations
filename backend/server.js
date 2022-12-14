const express = require('express');
var cors = require('cors')

const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ 
  credentials: true, 
  origin: ['http://localhost:3000'],
  methods: "GET,PUT,POST,DELETE",
}));

// parse application/json
app.use(express.json());

// Query 14 - register as GET
app.get('/organizations', routes.getOrganizations)

// Query 14 - register as GET
app.get('/countries', routes.getCountries)

// Query 13 - register as GET
app.get('/getBestAuthors', routes.getBestAuthors)

// Query 12 - register as GET
app.get('/mostEmployedCities', routes.mostEmployedCities)

// Query 11 - register as GET
app.get('/mostBenefitedOrg', routes.mostBenefitedOrg)

// Query 10 - register as GET
app.get('/topBioEdByCountry', routes.topBioEdByCountry)

// Query 9 - register as GET
app.get('/topInstituteByCountry', routes.topInstituteByCountry)

// Route 1 - 
app.get('/migration', routes.getMigrations)

// // Route 2 - 
app.get('/filterResearchers', routes.filterResearchers)

// // Route 3 
app.get('/paper/words', routes.filterPaperWords)

// // Route 4 
app.get('/paper/publications', routes.filterPaperPublication)

// // Route 5 
app.get('/researchers/top', routes.topResearcher)

// // Route 6 - register as GET 
app.get('/paper/totalbycountry', routes.getTotalPaperByCountry)

// Route Compare Countries 1
app.get('/twocountries/papersmoved', routes.PapersMoved2C)

// Route Compare Countries 2
app.get('/twocountries/bioentitiesmoved', routes.bioentitiesMoved2c)

// Route Compare Countries 3
app.get('/twocountries/movement', routes.movement2c)

// Route Compare Countries 4
app.get('/twocountries/sharedbioentities', routes.sharedBioentities2c)

// Route Compare Countries 5
app.get('/twocountries/papersboth', routes.papersBoth2c)

// login
app.post('/login', routes.login)

// signup
app.post('/signup', routes.signup)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
