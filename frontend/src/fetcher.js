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

const getAllCountries = async() => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/countries`, {
        method: 'GET',
    })
    return res.json()
}

const getAllOrganizations = async() => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/organizations`, {
        method: 'GET',
    })
    return res.json()
}


const getAllMigrations = async() => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/migration`, {
        method: 'GET',
    })
    return res.json()
}

const getSearchMigrations = async(phdYear, earliestYear, hasPhd, hasMigrated) => {
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

    url += employment !== "" ? `&employment=${employment}` : "";
    url += education !== "" ? `&education=${education}` : "";
    url += pmid !== "" ? `&pmid=${pmid}` : "";

    var res = await fetch(url, {
        method: 'GET',
    })

    return res.json()
}

const getPaperWords = async(wordsList) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/paper/words?words=${wordsList}`, {
        method: 'GET',
    })
    return res.json()
}

const getPublications = async() => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/paper/publications`, {
        method: 'GET',
    })
    return res.json()
}

const getSearchPublications = async(andid, pmid, auorder, pubyear) => {
    let url = `http://${config.server_host}:${config.server_port}/paper/publications?`;
    url += andid !== "" ? `&ANDID=${andid}` : "";
    url += pmid !== "" ? `&PMID=${pmid}` : "";
    url += auorder !== "" ? `&AuOrder=${auorder}` : "";
    url += pubyear !== "" ? `&PubYear=${pubyear}` : "";
    console.log(url);
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json()
}

const getTopResearchers = async(organization) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/researchers/top?organization=${organization}`, {
        method: 'GET',
    })
    return res.json()
}

const getBestAuthors = async() => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/getBestAuthors`, {
        method: 'GET',
    })
    return res.json()
}

const getMostBenefitedOrg = async() => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/mostBenefitedOrg`, {
        method: 'GET',
    })
    return res.json()
}

const searchMostBenefitedOrg = async(min, max) => {
    let url = `http://${config.server_host}:${config.server_port}/mostBenefitedOrg?`;
    url += min !== "" ? `&min=${min}` : "";
    url += max !== "" ? `&max=${max}` : "";
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json()
}

const getTotalPapersByCountry = async(country) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/paper/totalByCountry?country=${country}`, {
        method: 'GET',
    })
    return res.json()
}

const getTopInstituteByCountry = async(country) => {
    console.log(country);
    var res = await fetch(`http://${config.server_host}:${config.server_port}/topInstituteByCountry?country=${country}`, {
        method: 'GET',
    })
    return res.json()
}

const getTopBioEdByCountry = async(country) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/topBioEdByCountry?country=${country}`, {
        method: 'GET',
    })
    return res.json()
}

const getMostEmployedCities = async(country) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/mostEmployedCities?country=${country}`, {
        method: 'GET',
    })
    return res.json()
}

const getPapersMoved2C = async(country1, country2) => {
    let url = `http://${config.server_host}:${config.server_port}/twocountries/papersmoved?country1=${country1}&country2=${country2}`;
    console.log(url);
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json();
}

const getBioentitiesMoved2c = async(country1, country2) => {
    let url = `http://${config.server_host}:${config.server_port}/twocountries/bioentitiesmoved?country1=${country1}&country2=${country2}`;
    console.log(url);
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json();
}

const getMovement2c = async(country1, country2) => {
    let url = `http://${config.server_host}:${config.server_port}/twocountries/movement?country1=${country1}&country2=${country2}`;
    console.log(url);
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json();
}

const getSharedBioentities2c = async(country1, country2) => {
    let url = `http://${config.server_host}:${config.server_port}/twocountries/sharedbioentities?country1=${country1}&country2=${country2}`;
    console.log(url);
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json();
}

const getPapersBoth2c = async(country1, country2) => {
    let url = `http://${config.server_host}:${config.server_port}/twocountries/papersboth?country1=${country1}&country2=${country2}`;
    console.log(url);
    var res = await fetch(url, {
        method: 'GET',
    })
    return res.json();
}



const getVisualData = async() => {
  var res = await fetch(`http://${config.server_host}:${config.server_port}/visualdata`, {
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
    getTopResearchers,
    getBestAuthors,
    getMostBenefitedOrg,
    searchMostBenefitedOrg,
    getTotalPapersByCountry,
    getTopInstituteByCountry,
    getTopBioEdByCountry,
    getMostEmployedCities,
    getAllCountries,
    getVisualData,
    getAllOrganizations,
    postSignup,
    getPapersMoved2C,
    getBioentitiesMoved2c,
    getMovement2c,
    getSharedBioentities2c,
    getPapersBoth2c
}