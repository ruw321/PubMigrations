const config = require("./config.json");
const mysql = require("mysql");
const e = require("express");

// TODO: fill in your connection details here
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect();

// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function hello(req, res) {
  // a GET request to /hello?name=Steve
  if (req.query.name) {
    res.send(`Hello, ${req.query.name}! Welcome to the FIFA server!`);
  } else {
    res.send(`Hello! Welcome to the FIFA server!`);
  }
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
        res.json({error : error})
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
        res.json({error : error});
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
        res.json({error : error})
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
        res.json({error : error});
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
        res.json({error : error});
      } else if (results) {
        res.json({ results: results });
      }
    }
  )
}

module.exports = {
  hello,
  getBestAuthors,
  mostEmployedCities,
  mostBenefitedOrg,
  topBioEdByCountry,
  topInstituteByCountry
};