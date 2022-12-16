const config = require("./config.json");
const mysql = require("mysql");
const { MongoClient, ServerApiVersion } = require('mongodb');

// setting up configue information for database
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

// login fucntion to authenticate user
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

// helper function to split comma seperated string
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
        } //else {
        // sqlQuery += `WHERE ${propName} = '${req.query[propName]}' `;
        //}
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


// Get top authors by number of papers
/*
This query returns the authors who have written the most papers grouped by organization.
So the reuslt table is over organization along with it's most impactful researcher
*/

async function getBestAuthors(req, res) {
  // a GET request to /getBestAuthors

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
  LIMIT 100
  `

  connection.query(query,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error })
      } else if (results) {
        res.json({ results: results })
      }
    }
  )

}



/*
This query selects all cities from the Employment table and joins with the Author table
It groups by the city to find the ones where the most Authors work
*/
async function mostEmployedCities(req, res) {
  // a GET request to /mostEmployedCities?limit=100
  let query = `
  SELECT e.City, COUNT(*) as count FROM Employment e
  JOIN Authors a ON a.ANDID = e.ANDID
  WHERE Country = '${req.query.country}'
  GROUP BY e.City
  ORDER BY count DESC 
  LIMIT 100
  `;

  connection.query(query,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  )
}

/*
This query combines the migration and employment and employment table by using the ORCID table to
match the two table. It find the count of those who have migrated from every Organization and divides it
by the total number of employees at said organization, this returns the percentage of employees who have migrated
*/
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
        res.json({ error: error })
      } else if (results) {
        res.json({ results: results })
      }
    }
  )
}

/*
This query returns the top words mentioned in all papers by count. 
It accepts on optional country parameter that looks at papers published in a specific country
*/


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
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  )
}

/*
This query returns finds the most prolific institions in every country. We define this
by seeing which institutes have had researchers that prodcued the most papers while working
for a specific orginization.
*/
async function topInstituteByCountry(req, res) {
  // a GET request to /topInstitudeByCountry?country="Country"

  let query = `
  SELECT Organization, COUNT(*) AS NumPapers
  FROM PmidAndidInfo
  `;

  if (req.query.country) {
    query += `\n WHERE Country = '${req.query.country}'\n`
  }

  query += `GROUP BY Country, Organization
  ORDER BY NumPapers DESC 
  LIMIT 100`

  connection.query(query,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  )
}

/*
This query allows the user to search the mirgration table. It takes in parameters such as the year
the researcher aquiered their Phd, if they have a Phd or not, and if they have migrated or not.
*/

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
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

/*
This query allows the user to filter every researcher based on employment, education, and paper id. It combines the three tables that
inlcude ANDID and utilizes joins to group all the information.
*/


// example request is: http://localhost:8000/filterResearchers?Education=Tsinghua University&Employment=Tsinghua University&Writes=1726147
// TODO: note that the frontend will have to deal with different number of columns depending on how many tables we are joining
async function filterResearchers(req, res) {

  let sqlQuery = `WITH temp1 AS (
    SELECT ANDID, PMID
    FROM Writes
  ),
    temp2a AS (
        SELECT ANDID FROM Education
        WHERE Organization LIKE '%${req.query.education}%'
    ),
  temp2 AS (
    SELECT ANDID, GROUP_CONCAT(Organization SEPARATOR ', ') AS Education
    FROM Education
    WHERE ANDID IN (
        SELECT * FROM temp2a
    )
    GROUP BY ANDID
  ),
    temp3a AS (
        SELECT ANDID FROM Employment
        WHERE Organization LIKE '%${req.query.employment}%'
    ),
  temp3 AS (
    SELECT ANDID, GROUP_CONCAT(Organization SEPARATOR ', ') AS Employment
    FROM Employment
    WHERE ANDID IN (
        SELECT * FROM temp3a
    )
    GROUP BY ANDID
  )
  SELECT ANDID, LastName, Initials, BeginYear,
  Employment, Education, GROUP_CONCAT(PMID SEPARATOR ', ') AS Papers
  FROM Authors au
    NATURAL JOIN temp2
    NATURAL JOIN temp3
    NATURAL JOIN temp1
    GROUP BY ANDID, LastName, Initials, BeginYear, Employment, Education
    LIMIT 100;`;

  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );

}

/*
This query finds all papers which contain at least one instance of the user specified
word that will be inputted. This allows the user to search relevant terms to find papers of interest.
*/
// example request: http://localhost:8000/paper/words?words=brain,neurology
async function filterPaperWords(req, res) {
  let listOfWords = "";
  if (req.query.words) {
    listOfWords = processSearchWords(req.query.words);
  } else {
    res.json({ error: "search query is empty" });
    return;
  }

  let sqlQuery = `
    WITH temp1 AS (
    SELECT PMID, Mention, COUNT(*) AS Count
    FROM BioEntities
    WHERE Mention IN (${listOfWords})
    GROUP BY PMID, Mention
    )
    SELECT PMID, GROUP_CONCAT(Mention) AS TermsFound, SUM(Count) AS Count
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
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}


/*
This query allows the Papers and Authors tables to be used in order to find papers
that match a given criteria. The user can select from specific authors, publication year
specifc paper ID, and the order on authors name appears within the list of authors
*/
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
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}



/*
This query returns the top research from every organziation, it may seem similar to a previos query,
however in this one the author is included if they have ever worked or studied at at least one of the 
parameters that was inputted. The user has the choice of education, employment, or paper id.
*/


// example request: http://localhost:8000/researchers/top?Organization=Tsinghua University
// this one takes about 2 minutes
// be careful with parsing in the frontend, it returns more stuff but it has multiple sql statements
async function topResearcher(req, res) {
  if (!req.query.Organization) {
    res.json({ error: "Organization is not specified" });
    return;
  }
  const organization = req.query.organization;
  let sqlQuery = `
    SELECT ANDID, Count(*) AS NumPapers
    FROM PmidAndidInfo
    WHERE Organization LIKE '%${organization}%'
    GROUP BY ANDID
    ORDER BY NumPapers DESC
    LIMIT 100
    `;



  // we have implemented this for you to see how to return results by querying the database
  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }

  );

}


/*
This query returns the number of papers that have been produced by a given country. A paper is produced by a country
if the author of that paper is located in the country when the paper was published.
*/

async function getTotalPaperByCountry(req, res) {
  let sqlQuery = `
  SELECT Country, COUNT(*) as NumPapers
  FROM PmidAndidInfo
  WHERE COUNTRY = '${req.query.country}'
  GROUP BY Country
  ORDER BY NumPapers`;

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

/*
This simple query returns all the countries that are in the database. It is used for displaying the countries page.
*/

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
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

/*

*/

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

  if (req.query.page && !isNaN(req.query.page)) {
    // TODO: add the page feature 
  } else {
    // we have implemented this for you to see how to return results by querying the database
    connection.query(sqlQuery,
      function (error, results, fields) {
        if (error) {
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
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

async function PapersMoved2C(req, res) {
  let sqlQuery = ` WITH temp1 AS (
    SELECT ORCID FROM Migrations
    WHERE EarliestCountry = "${req.query.country1}"
    AND Country2016 = "${req.query.country2}"
  ),
  temp2 AS (
    SELECT ANDID FROM temp1
    NATURAL JOIN ORCIDs
  )
  SELECT COUNT(*) AS count FROM temp2
  NATURAL JOIN PmidAndidInfo `;


  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );

}

async function bioentitiesMoved2c(req, res) {
  let sqlQuery = ` WITH temp1 AS (
    SELECT ORCID
    FROM Migrations
    WHERE EarliestCountry = "${req.query.country1}"
    AND Country2016 = "${req.query.country2}"
  ),
  temp2 AS (
    SELECT ANDID
    FROM temp1
    NATURAL JOIN ORCIDs
  ),
  temp3 AS (
    SELECT *
    FROM temp2
    NATURAL JOIN PmidAndidInfo
  )
  SELECT Mention, COUNT(*) as Count
  FROM temp3
  NATURAL JOIN BioEntities
  GROUP BY Mention
  ORDER BY Count DESC
  LIMIT 100; `;


  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );

}

async function movement2c(req, res) {
  let sqlQuery = ` WITH temp1 AS (
    SELECT COUNT(*) AS Count
    FROM Migrations
    WHERE EarliestCountry = "${req.query.country1}"
    AND Country2016 = "${req.query.country2}"
  ),
  temp2 AS (
    SELECT COUNT(*) AS Count
    FROM Migrations
    WHERE EarliestCountry = "${req.query.country2}"
    AND Country2016 = "${req.query.country1}"
  )
  SELECT temp1.count - temp2.count AS Count
  FROM temp1, temp2
   `;


  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );

}

async function sharedBioentities2c(req, res) {
  let sqlQuery = ` WITH temp1 AS(
    SELECT Mention, Count(*) as Count
    FROM PmidAndidInfo
    INNER JOIN BioEntities
    ON PmidAndidInfo.PMID = BioEntities.PMID
    WHERE Country = "${req.query.country1}"
    GROUP BY Mention
    ORDER BY Count DESC
    LIMIT 100
  ),
  temp2 AS (
    SELECT Mention, Count(*) as Count
    FROM PmidAndidInfo
    INNER JOIN BioEntities
    ON PmidAndidInfo.PMID = BioEntities.PMID
    WHERE Country = "${req.query.country2}"
    GROUP BY Mention
    ORDER BY Count DESC
    LIMIT 100
  )
  SELECT temp1.Mention as Mention, temp1.Count + temp2.Count as Count
  FROM temp1 INNER JOIN temp2
  ON temp1.Mention = temp2.mention
  ORDER BY Count DESC
  LIMIT 100;`;


  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );

}

async function papersBoth2c(req, res) {
  let sqlQuery = `WITH country1 AS (
    SELECT ANDID
    FROM Employment
    WHERE Country = '${req.query.country1}'
    UNION
    (SELECT ANDID
     FROM Education
     WHERE Country = '${req.query.country1}'
    )
),
country2 AS (
    SELECT ANDID
    FROM Employment
    WHERE Country = '${req.query.country2}'
    UNION
    (SELECT ANDID
     FROM Education
     WHERE Country = '${req.query.country2}'
    )
),
  temp1 AS (
    SELECT PMID, ANDID FROM Writes w1
    WHERE EXISTS (
      SELECT * FROM Writes w2
      WHERE w2.PMID = w1.PMID
      AND w2.ANDID IN (SELECT * FROM country1)
    )
    AND EXISTS (
      SELECT * FROM Writes w3
      WHERE w3.PMID = w1.PMID
      AND w3.ANDID IN (SELECT * FROM country2)
    )
    AND (ANDID IN (SELECT * FROM country1)
    OR ANDID IN (SELECT * FROM country2))
  )
  SELECT PMID, GROUP_CONCAT(ANDID SEPARATOR ', ') AS Authors
  FROM temp1
  GROUP BY PMID
  LIMIT 100;`;


  connection.query(sqlQuery,
    function (error, results, fields) {
      if (error) {
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );

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
  getOrganizations,
  PapersMoved2C,
  bioentitiesMoved2c,
  movement2c,
  sharedBioentities2c,
  papersBoth2c,
  getVisualData,
  getOrganizations
};
