const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

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

// // Route 7 - register as GET 
// app.get('/search/matches', routes.search_matches)

// // Route 8 - register as GET 
// app.get('/search/players', routes.search_players)





app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
