const config = require("./config.json");
const mysql = require("mysql");
const { MongoClient, ServerApiVersion } = require('mongodb');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  multipleStatements: true
});
connection.connect();

// Connecting to MongoDB
const client = new MongoClient(config.mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  // check if the email exists
  try {
    const collection = client.db("CIS550").collection("Users");
    const result = await collection.findOne({ Email: email });
    if (!result) {
      res.status(404).json({ error: "email doesn't exist" });
    } else {
      // check the password
      if (result.Password === password) {
        res.status(200).json({ result: "user successfully logged in" });
      } else {
        res.status(401).json({ result: "wrong password" });
      }
    }
  } catch (e) {
    res.status(400).json({ error: e });
  } finally {
    //await client.close();
  }
}

async function signup(req, res) {
  try {
    const collection = client.db("CIS550").collection("Users");
    await collection.createIndex({ "Email": 1 }, { unique: true });
    const result = await collection.insertOne({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.email,
      Password: req.body.password
    });
    res.status(201).json({ InsertedID: result.insertedId });
  } catch (e) {
    res.status(409).json({ error: e.errmsg });
  } finally {
    //await client.close();
  }
}

// helper function
function processSearchWords(words) {
  let wordList = words.split(',');
  wordList.forEach(function (part, index, theArray) {
    theArray[index] = `'${theArray[index]}'`;
  });
  return wordList.toString();
}

// helper function
function multipleWhere(req, integerProperty, sqlQuery) {
  let firstProperty = true;
  for (var propName in req.query) {
    if (req.query.hasOwnProperty(propName)) {
      if (firstProperty) {
        if (integerProperty.includes(propName)) {
          sqlQuery += `WHERE ${propName} = ${req.query[propName]} `;
        } else {
          sqlQuery += `WHERE ${propName} = '${req.query[propName]}' `;
        }
        firstProperty = false;
      } else {
        if (integerProperty.includes(propName)) {
          sqlQuery += `AND ${propName} = ${req.query[propName]} `;
        } else {
          sqlQuery += `AND ${propName} = '${req.query[propName]}' `;
        }
      }
    }
  }
  return sqlQuery;
}

// Query 13
async function getBestAuthors(req, res) {
  // a GET request to /getBestAuthors?limit=100
  let limit = 100
  if (req.query.limit) {
    limit = req.query.limit
  }

  let query = `
  WITH temp1 AS (
    SELECT ANDID, COUNT(*) AS count FROM Writes
    GROUP BY ANDID
  ),
  temp2 AS (
      SELECT e.Organization, e.City, e.ANDID AS ANDID FROM Education e
      JOIN Employment E2 on e.ANDID = E2.ANDID
  )
  SELECT temp2.Organization, temp2.City, SUM(temp1.count) AS count FROM temp2
  JOIN temp1 ON temp1.ANDID = temp2.ANDID
  GROUP BY temp2.Organization
  ORDER BY count DESC
  LIMIT ${limit}
  `

  connection.query(query,
    function (error, results, fields) {
      if (error) {
        console.log(error)
        res.json({ error: error })
      } else if (results) {
        res.json({ results: results })
      }
    }
  )

}

// Query 12
async function mostEmployedCities(req, res) {
  // a GET request to /mostEmployedCities?limit=100
  let limit = 100;
  if (req.query.limit) {
    limit = req.query.limit;
  }

  let query = `
  SELECT e.City, COUNT(*) as count FROM Employment e
  JOIN Authors a ON a.ANDID = e.ANDID
  GROUP BY e.City
  ORDER BY count DESC 
  LIMIT ${limit}
  `;
  connection.query(query,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  )
}

// Query 11
async function mostBenefitedOrg(req, res) {
  // a GET request to /mostBenefitedOrg?limit=100m
  let limit = 100;
  let min = 0;
  let max = 1;
  if (req.query.limit) {
    limit = req.query.limit;
  }
  if (req.query.min) {
    min = req.query.min;
  }
  if (req.query.max) {
    max = req.query.max;
  }

  let query = `
  WITH hasMigrated AS
  (
    SELECT ORCID FROM Migrations
    WHERE HasMigrated = True
  ),
  ANDID_migrated AS
  (
    SELECT ANDID FROM ORCIDs
    WHERE ORCID IN
    (
      SELECT ORCID FROM hasMigrated
    )
  ),
  paperCounts AS
  (
    SELECT ANDID, COUNT(*) AS count FROM Writes
    GROUP BY ANDID
  ),
  Orgnization_Paper_Count AS
  (
    SELECT e.Organization, SUM(pc.count) AS COUNT
    FROM paperCounts pc
    JOIN Employment e ON e.ANDID = pc.ANDID
    GROUP BY e.Organization
  ),

  Organization_Migration_Paper_Count AS
  (
    SELECT e.Organization, SUM(pc.count) AS Count
    FROM paperCounts pc
    JOIN Employment e ON e.ANDID = pc.ANDID
    WHERE e.ANDID IN
    (
      SELECT ANDID FROM ANDID_migrated
    )
    GROUP BY e.Organization
  )
  SELECT o.Organization, om.Count / o.Count AS Percentage
  FROM Orgnization_Paper_Count o
  JOIN Organization_Migration_Paper_Count om ON o.Organization = om.Organization
  WHERE om.Count / o.Count >= ${min} AND om.Count / o.Count <= ${max}
  ORDER BY om.Count / o.Count DESC
  LIMIT ${limit}

  `
  connection.query(query,
    function (error, results, fields) {
      if (error) {
        console.log(error)
        res.json({ error: error })
      } else if (results) {
        res.json({ results: results })
      }
    }
  )
}

// Query 10
async function topBioEdByCountry(req, res) {
  // a GET request to /topBioEdByCountry?limit=100&country=
  let limit = 100;
  if (req.query.limit) {
    limit = req.query.limit;
  }

  let query = `
  SELECT Mention, Count(*) as Count
  FROM PmidAndidInfo
  INNER JOIN BioEntities
  ON PmidAndidInfo.PMID = BioEntities.PMID
  `;

  if (req.query.country) {
    query += `\n WHERE Country = '${req.query.country}'\n`;
  }

  query += `GROUP BY Mention
  ORDER BY Count DESC
  LIMIT ${limit}`;

  connection.query(query,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  )
}

// Query 9
async function topInstituteByCountry(req, res) {
  // a GET request to /topInstitudeByCountry?limit=100&Country="Country"
  let limit = 100;
  if (req.query.limit) {
    limit = req.query.limit;
  }

  let query = `
  SELECT Country, Organization, COUNT(*) AS NumPapers
  FROM PmidAndidInfo
  `;

  if (req.query.country) {
    query += `\n WHERE Country = '${req.query.country}'\n`
  }

  query += `GROUP BY Country, Organization
  ORDER BY NumPapers DESC 
  LIMIT ${limit}`

  connection.query(query,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  )
}

// example request: http://localhost:8000/migration?PhdYear=2000&EarliestYear=2000&HasPhd=1
async function getMigrations(req, res) {
  let sqlQuery = `SELECT * FROM Migrations `;
  const integerProperty = ["PhdYear", "EarliestYear", "HasPhd", "HasMigrated"];
  sqlQuery = multipleWhere(req, integerProperty, sqlQuery);

  sqlQuery += `\nLIMIT 100`;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// example request is: http://localhost:8000/filterResearchers?Education=Tsinghua University&Employment=Tsinghua University&Writes=1726147
// TODO: note that the frontend will have to deal with different number of columns depending on how many tables we are joining
async function filterResearchers(req, res) {
  let sqlQuery = `WITH temp1 AS (
    SELECT ANDID, GROUP_CONCAT(PMID SEPARATOR ', ') AS Papers
    FROM Writes
    GROUP BY ANDID
  ),
  temp2 AS (
    SELECT ANDID, GROUP_CONCAT(Organization SEPARATOR ', ') AS Education
    FROM Education
    GROUP BY ANDID
  ),
  temp3 AS (
    SELECT ANDID, GROUP_CONCAT(Organization SEPARATOR ', ') AS Employment
    FROM Employment
    GROUP BY ANDID
  )
  SELECT au.ANDID AS ANDID, LastName, Initials, au.BeginYear as BeginYear,
  Employment, Education, Papers
  FROM Authors au
  NATURAL JOIN temp1
  NATURAL JOIN temp2
  NATURAL JOIN temp3
  WHERE 1 = 1 `;

  if (req.query.employment) {
    sqlQuery += `AND EXISTS (
      SELECT *
      FROM temp3
      WHERE temp3.ANDID = au.ANDID
      AND temp3.Employment LIKE "%${req.query.employment}%"
      
    )`
  }

  if (req.query.education) {
    sqlQuery += `AND EXISTS (
      SELECT *
      FROM temp2
      WHERE temp2.ANDID = au.ANDID
      AND temp2.Education LIKE "%${req.query.education}%"
    ) `
  }

  if (req.query.pmid) {
    sqlQuery += `AND EXISTS (
      SELECT *
      FROM temp1
      WHERE temp1.ANDID = au.ANDID
      AND temp1.Papers LIKE "%${req.query.pmid}%"
    ) `
  }

  sqlQuery += `GROUP BY au.ANDID, LastName, Initials, au.BeginYear
                LIMIT 100;`;

  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        console.log("finished query");
        res.json({ results: results });
      }
    }
  );

}

// example request: http://localhost:8000/paper/words?words=brain,neurology
async function filterPaperWords(req, res) {
  let listOfWords = "";
  if (req.query.words) {
    listOfWords = processSearchWords(req.query.words);
  } else {
    res.json({ error: "search query is empty" });
    return;
  }
  console.log(listOfWords);
  let sqlQuery = `WITH temp1 AS (
    SELECT DISTINCT PMID, Mention
    FROM BioEntities
    WHERE Mention IN (${listOfWords})
    )
    SELECT PMID, GROUP_CONCAT(Mention) AS TermsFound, COUNT(*) AS Count
    FROM temp1
    GROUP BY PMID
    ORDER BY Count DESC
    LIMIT 100;     
    `;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// example request: http://localhost:8000/paper/publications?PubYear=1975&PMID=1
async function filterPaperPublication(req, res) {
  let sqlQuery = `WITH temp1 AS (
    SELECT * FROM Papers
    NATURAL JOIN Writes
    ),
    temp2 AS (
      SELECT ANDID, LastName, Initials
      FROM Authors
    )
    SELECT * FROM temp1
    NATURAL JOIN temp2      
    `;

  const integerProperty = ["ANDID", "PMID", "AuOrder", "PubYear"];
  sqlQuery = multipleWhere(req, integerProperty, sqlQuery);

  sqlQuery += `\nLIMIT 100`;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}



// example request: http://localhost:8000/researchers/top?Organization=Tsinghua University
// this one takes about 2 minutes 
// be careful with parsing in the frontend, it returns more stuff but it has multiple sql statements
async function topResearcher(req, res) {
  if (!req.query.Organization) {
    res.json({ error: "Organization is not specified" });
    return;
  }
  const SearchLimit = req.query.SearchLimit ? req.query.SearchLimit : 100;
  const Organization = req.query.Organization;
  let sqlQuery = `
    SELECT ANDID, Count(*) AS NumPapers
    FROM PmidAndidInfo
    WHERE Organization = '${Organization}'
    GROUP BY ANDID
    ORDER BY NumPapers DESC
    LIMIT ${SearchLimit}
    `;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

async function getTotalPaperByCountry(req, res) {
  let sqlQuery = `
  SELECT Country, COUNT(*) as NumPapers FROM PmidAndidInfo GROUP BY Country ORDER BY NumPapers`;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// example request: http://localhost:8000/countries?
async function getCountries(req, res) {
  let sqlQuery = `SELECT * FROM Countries `;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

async function getVisualData(req, res) {
  let sqlQuery = `WITH temp1 AS (
    SELECT ORCID, EarliestCountry, Country2016
    FROM Migrations
    WHERE HasMigrated = 1
    ),
    temp2 AS (
        SELECT EarliestCountry, Country2016, ANDID
        FROM temp1
        NATURAL JOIN ORCIDs
    ),
    temp3 AS (
        SELECT ANDID, PMID
        FROM Writes
    )
    SELECT ANDID, EarliestCountry, Country2016, COUNT(PMID) AS Count
    FROM temp2
    NATURAL JOIN temp3
    WHERE EarliestCountry != Country2016 AND EarliestCountry != '??' AND Country2016 != '??'
    GROUP BY ANDID, EarliestCountry, Country2016
    ORDER BY Count DESC
    LIMIT 150;
  `
  // let sqlQuery = `WITH temp1 AS (
  //   SELECT ORCID, c1.name AS EarliestCountry, c2.name AS Country2016
  //   FROM Migrations
  //   INNER JOIN Countries c1
  //   ON Migrations.EarliestCountry = c1.Alpha2Code
  //   INNER JOIN Countries c2
  //   ON Migrations.Country2016 = c2.Alpha2Code
  //   WHERE HasMigrated = 1
  //   ),
  //   temp2 AS (
  //     SELECT EarliestCountry, Country2016, ANDID
  //     FROM temp1
  //     NATURAL JOIN ORCIDs
  //   ),
  //   temp3 AS (
  //     SELECT ANDID, PMID
  //     FROM Writes
  //   )
  //   SELECT ANDID, EarliestCountry, Country2016, COUNT(PMID) AS Count
  //   FROM temp2
  //   NATURAL JOIN temp3
  //   WHERE EarliestCountry != Country2016 AND EarliestCountry != 'Unknown' AND Country2016 != 'Unknown'
  //   GROUP BY ANDID, EarliestCountry, Country2016
  //   ORDER BY Count DESC
  //   LIMIT 150;`;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}


// example request: http://localhost:8000/organizations?
async function getOrganizations(req, res) {
  let sqlQuery = `SELECT DISTINCT Organization FROM PmidAndidInfo `;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}


module.exports = {
  getMigrations,
  filterResearchers,
  filterPaperWords,
  filterPaperPublication,
  topResearcher,
  getTotalPaperByCountry,
  getBestAuthors,
  mostEmployedCities,
  mostBenefitedOrg,
  topBioEdByCountry,
  topInstituteByCountry,
  login,
  signup,
  getCountries,
  getVisualData,
  getOrganizations
};
