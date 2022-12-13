import config from './config.json'

const postLogin = async(email, password) => {
  var res = await fetch(`http://${config.server_host}:${config.server_port}/login`, {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({email: email, password: password})
  })
  return res.json()
}

const postSignup = async(email, password, firstName, lastName) => {
  var res = await fetch(`http://${config.server_host}:${config.server_port}/signup`, {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({email: email, password: password, FirstName: firstName, LastName: lastName})
  })
  return res.json()
}

const getAllCountries = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/countries`, {
        method: 'GET',
    })
    return res.json()
}

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

const getResearchers = async(employment, education, pmid) => {
    
    let url = `http://${config.server_host}:${config.server_port}/filterResearchers?`;

    url += employment !== "" ? `&Employment=${employment}` : "";
    url += education !== "" ? `&Education=${education}` : "";
    url += pmid !== "" ? `&Writes=${pmid}` : "";

    var res = await fetch(url, {
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

const getSearchPublications = async(andid, pmid, auorder, pubyear, page, pagesize) => {
    let url = `http://${config.server_host}:${config.server_port}/paper/publications?`;
    url += andid !== "" ? `&ANDID=${andid}` : "";
    url += pmid !== "" ? `&PMID=${pmid}` : "";
    url += auorder !== "" ? `&AuOrder=${auorder}` : "";
    url += pubyear !== "" ? `&PubYear=${pubyear}` : "";
    var res = await fetch(url, {
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

const searchMostBenefitedOrg = async(min, max, page, pagesize) => {
    let url = `http://${config.server_host}:${config.server_port}/mostBenefitedOrg?`;
    url += min !== "" ? `&min=${min}` : "";
    url += max !== "" ? `&max=${max}` : "";
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json()
}

const getTotalPapersByCountry = async(page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/paper/totalByCountry`, {
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

export {
    postLogin,
    getAllMigrations,
    getSearchMigrations,
    getResearchers,
    getPaperWords,
    getPublications,
    getSearchPublications,
    getTopInstitutions,
    getBestAuthors,
    getMostBenefitedOrg,
    searchMostBenefitedOrg,
    getTotalPapersByCountry,
    getTopInstituteByCountry,
    getTopBioEdByCountry,
    getMostEmployedCities,
    getAllCountries,
    postSignup
}