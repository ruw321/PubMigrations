import config from './config.json'

const getAllMigrations = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/migration`, {
        method: 'GET',
    })
    return res.json()
}

const getSearchMigrations = async(phdYear, earliestYear, hasPhd, hasMigrated, page, pagesize) => {
    let url = `http://${config.server_host}:${config.server_port}/migration?`;
    url += phdYear !== "" ? `&PhdYear=${phdYear}` : "";
    url += earliestYear !== "" ? `&EarliestYear=${earliestYear}` : "";
    url += hasPhd !== "" ? `&HasPhd=${hasPhd}` : "";
    url += hasMigrated !== "" ? `&HasMigrated=${hasMigrated}` : "";
    console.log(url);
    // var res = await fetch(`http://${config.server_host}:${config.server_port}/migration?PhdYear=${phdYear}&EarliestYear=${earliestYear}`, {
    var res = await fetch(url, {

        method: 'GET',
    })
    return res.json()
}

const getAllResearchers = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/filterResearchers`, {
        method: 'GET',
    })
    return res.json()
}

const getPaperWords = async(wordsList, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/paper/words?words=${wordsList}`, {
        method: 'GET',
    })
    return res.json()
}

const getPublications = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/paper/publications`, {
        method: 'GET',
    })
    return res.json()
}

const getTopInstitutions = async(organization, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/researchers/top?Organization=${organization}`, {
        method: 'GET',
    })
    return res.json()
}

const getBestAuthors = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/getBestAuthors`, {
        method: 'GET',
    })
    return res.json()
}

const getMostBenefitedOrg = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/mostBenefitedOrg`, {
        method: 'GET',
    })
    return res.json()
}

const getTotalPapersByCountry = async(country, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/paper/totalByCountry?country=${country}`, {
        method: 'GET',
    })
    return res.json()
}

const getTopInstituteByCountry = async(country, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/topInstituteByCountry?country=${country}`, {
        method: 'GET',
    })
    return res.json()
}

const getTopBioEdByCountry = async(country, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/topBioEdByCountry?country=${country}`, {
        method: 'GET',
    })
    return res.json()
}

const getMostEmployedCities = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/mostEmployedCities`, {
        method: 'GET',
    })
    return res.json()
}



const getAllMatches = async (page, pagesize, league) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/matches/${league}?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllPlayers = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatch = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/match?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayer = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/player?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatchSearch = async (home, away, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/matches?Home=${home}&Away=${away}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayerSearch = async (name, nationality, club, rating_high, rating_low, pot_high, pot_low, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Club=${club}&RatingLow=${rating_low}&RatingHigh=${rating_high}&PotentialHigh=${pot_high}&PotentialLow=${pot_low}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}













export {
    getAllMigrations,
    getSearchMigrations,
    getAllResearchers,
    getPaperWords,
    getPublications,
    getTopInstitutions,
    getBestAuthors,
    getMostBenefitedOrg,
    getTotalPapersByCountry,
    getTopInstituteByCountry,
    getTopBioEdByCountry,
    getMostEmployedCities,

    getAllMatches,
    getAllPlayers,
    getMatch,
    getPlayer,
    getMatchSearch,
    getPlayerSearch
}