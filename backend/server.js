const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 8000
app.use(cors({ credentials: true, origin: ['http://localhost:8000'] }));

// Route 1 - register as GET 
app.get('/hello', routes.hello)

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

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
