const config = require("./config.json");
const mysql = require("mysql");
// const e = require("express");
// const { query } = require("express");

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

// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// helper function for searching papers by words 
function processSearchWords(words) {
  let wordList = words.split(',');
  wordList.forEach(function(part, index, theArray) {
    theArray[index] = `'${theArray[index]}'`;
  }); 
  return wordList.toString();
}

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
  let sqlQuery = `SELECT * FROM Authors au `;
  let where = `WHERE `;
  let temp = 'a';
  let firstProperty = true;
  for (var propName in req.query) {
    if (req.query.hasOwnProperty(propName)) {
      sqlQuery += `JOIN ${propName} ${temp} ON ${temp}.ANDID = au.ANDID `;    
      if (!firstProperty) {
        where += 'AND ';
      }
      if (propName == 'Writes') {
        where += `${temp}.PMID = ${req.query[propName]} `;
      } else {
        where += `${temp}.Organization = '${req.query[propName]}' `;
      }
      firstProperty = false;
    }
    temp = String.fromCharCode(temp.charCodeAt(0) + 1);
  }
  
  if (where.length > 6) {
    sqlQuery += where;
  }
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
  let sqlQuery = `CREATE OR REPLACE VIEW AuthorCountriesOrgYear (ANDID, BeginYear, Country, Organization) AS (
      SELECT ANDID, BeginYear, Country, Organization
      FROM Employment
      UNION
      (SELECT ANDID, BeginYear, Country, Organization
      FROM Education)
      ORDER BY ANDID ASC, BeginYear DESC
    );
    CREATE OR REPLACE VIEW PmidAndidInfo (PMID, ANDID, BeginYear, Country, Organization) AS (
      WITH temp1 AS (
        SELECT * FROM Papers
        NATURAL JOIN Writes
        WHERE AuOrder = 1
      ),
      temp2 AS (
        SELECT PMID, temp1.ANDID AS ANDID, PubYear, BeginYear, Country, Organization
        FROM temp1, AuthorCountriesOrgYear
        WHERE temp1.ANDID = AuthorCountriesOrgYear.ANDID
        AND temp1.PubYear >= AuthorCountriesOrgYear.BeginYear
      ),
      temp3 AS (
        SELECT PMID, ANDID, MAX(BeginYear) AS BeginYear
        FROM temp2
        GROUP BY ANDID, PMID
      )
      SELECT PMID, ANDID, BeginYear, Country, Organization
      FROM temp2
      WHERE (PMID, ANDID, BeginYear) IN (SELECT * FROM temp3)
    );
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
  let sqlQuery = `CREATE OR REPLACE VIEW AuthorCountriesOrgYear (ANDID, BeginYear, Country, Organization) AS (
    SELECT ANDID, BeginYear, Country, Organization
    FROM Employment
    UNION
    (SELECT ANDID, BeginYear, Country, Organization
    FROM Education)
    ORDER BY ANDID ASC, BeginYear DESC
  );
  CREATE OR REPLACE VIEW PmidAndidInfo (PMID, ANDID, BeginYear, Country, Organization) AS (
    WITH temp1 AS (
      SELECT * FROM Papers
      NATURAL JOIN Writes
      WHERE AuOrder = 1
    ),
    temp2 AS (
      SELECT PMID, temp1.ANDID AS ANDID, PubYear, BeginYear, Country, Organization
      FROM temp1, AuthorCountriesOrgYear
      WHERE temp1.ANDID = AuthorCountriesOrgYear.ANDID
      AND temp1.PubYear >= AuthorCountriesOrgYear.BeginYear
    ),
    temp3 AS (
      SELECT PMID, ANDID, MAX(BeginYear) AS BeginYear
      FROM temp2
      GROUP BY ANDID, PMID
    )
    SELECT PMID, ANDID, BeginYear, Country, Organization
    FROM temp2
    WHERE (PMID, ANDID, BeginYear) IN (SELECT * FROM temp3)
  );
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

// // Route 2 (handler)
// async function jersey(req, res) {
//   const colors = ["red", "blue", "white"];
//   const jersey_number = Math.floor(Math.random() * 20) + 1;
//   const name = req.query.name ? req.query.name : "player";

//   if (req.params.choice === "number") {
//     // TODO: TASK 1: inspect for issues and correct
//     res.json({ message: `Hello, ${name}!`, jersey_number: jersey_number });
//   } else if (req.params.choice === "color") {
//     var lucky_color_index = Math.floor(Math.random() * 2);
//     // TODO: TASK 2: change this or any variables above to return only 'red' or 'blue' at random (go Quakers!)
//     res.json({
//       message: `Hello, ${name}!`,
//       jersey_color: colors[lucky_color_index],
//     });
//   } else {
//     // TODO: TASK 3: inspect for issues and correct
//     res.json({ message: `Hello, ${name}, we like your jersey!` });
//   }
// }

// // ********************************************
// //               GENERAL ROUTES
// // ********************************************

// // Route 3 (handler)
// async function all_matches(req, res) {
//   // TODO: TASK 4: implement and test, potentially writing your own (ungraded) tests
//   // We have partially implemented this function for you to
//   // parse in the league encoding - this is how you would use the ternary operator to set a variable to a default value
//   // we didn't specify this default value for league, and you could change it if you want!
//   // in reality, league will never be undefined since URLs will need to match matches/:league for the request to be routed here...
//   const league = req.params.league ? req.params.league : "D1";
//   // use this league encoding in your query to furnish the correct results

//   if (req.query.page && !isNaN(req.query.page)) {
//     // This is the case where page is defined.
//     // The SQL schema has the attribute OverallRating, but modify it to match spec!
//     // TODO: query and return results here:
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10;
//     const page = req.query.page;
//     connection.query(
//       `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
//           FROM Matches 
//           WHERE Division = '${league}'
//           ORDER BY HomeTeam, AwayTeam`,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           filteredResults = [];
//           for (let i = (page - 1) * pagesize; i < page * pagesize; i++) {
//             if (i < results.length) {
//               filteredResults.push(results[i]);
//             }
//           }
//           res.json({ results: filteredResults });
//         }
//       }
//     );
//   } else {
//     // we have implemented this for you to see how to return results by querying the database
//     connection.query(
//       `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
//         FROM Matches 
//         WHERE Division = '${league}'
//         ORDER BY HomeTeam, AwayTeam`,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           res.json({ results: results });
//         }
//       }
//     );
//   }
// }

// // Route 4 (handler)
// async function all_players(req, res) {
//   // TODO: TASK 5: implement and test, potentially writing your own (ungraded) tests

//   if (req.query.page && !isNaN(req.query.page)) {
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10;
//     const page = req.query.page;

//     connection.query(
//       `SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
//           FROM Players 
//           ORDER BY Name ASC`,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           filteredResults = [];
//           for (let i = (page - 1) * pagesize; i < page * pagesize; i++) {
//             if (i < results.length) {
//               filteredResults.push(results[i]);
//             }
//           }
//           res.json({ results: filteredResults });
//         }
//       }
//     );
//   } else {
//     connection.query(
//       `SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value  
//           FROM Players 
//           ORDER BY Name ASC`,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           res.json({ results: results });
//         }
//       }
//     );
//   }

//   //   return res.json({ error: "Not implemented" });
// }

// // ********************************************
// //             MATCH-SPECIFIC ROUTES
// // ********************************************

// // Route 5 (handler)
// async function match(req, res) {
//   // TODO: TASK 6: implement and test, potentially writing your own (ungraded) tests
//   const id = req.query.id;

//   if (id && !isNaN(id)) {
//     connection.query(
//       `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals,
//     HalfTimeGoalsH AS HTHomeGoals, HalfTimeGoalsA AS HTAwayGoals, ShotsH AS ShotsHome, ShotsA AS ShotsAway, ShotsOnTargetH AS ShotsOnTargetHome,
//     ShotsOnTargetA AS ShotsOnTargetAway, FoulsH AS FoulsHome, FoulsA AS FoulsAway, CornersH AS CornersHome, CornersA AS CornersAway,
//     YellowCardsH AS YCHome, YellowCardsA AS YCAway, RedCardsH AS RCHome, RedCardsA AS RCAway
//       FROM Matches 
//       WHERE Matchid = '${id}'`,
//       // ORDER BY HomeTeam, AwayTeam`,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           res.json({ results: results });
//         }
//       }
//     );
//   } else {
//     return res.json({ results: [] });
//   }
// }

// // ********************************************
// //            PLAYER-SPECIFIC ROUTES
// // ********************************************

// // Route 6 (handler)
// async function player(req, res) {
//   // TODO: TASK 7: implement and test, potentially writing your own (ungraded) tests
//   const id = req.query.id;

//   if (id && !isNaN(id)) {
//     connection.query(
//       `SELECT PlayerId, Name, Age, Photo, Nationality, Flag, OverallRating AS Rating, Potential, Club, ClubLogo, Value, Wage, InternationalReputation,
//         Skill, JerseyNumber, ContractValidUntil, Height, Weight, BestPosition, BestOverallRating, ReleaseClause,
//         GKPenalties, GKDiving, GKHandling, GKKicking, GKPositioning, GKReflexes,
//         NPassing, NBallControl, NAdjustedAgility, NStamina, NStrength, NPositioning  
//         FROM Players 
//         WHERE PlayerId='${id}'
//         ORDER BY Name ASC`,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results.length > 0 && results) {
//           if (results[0]["BestPosition"] == "GK") {
//             delete results[0]["NPassing"];
//             delete results[0]["NBallControl"];
//             delete results[0]["NAdjustedAgility"];
//             delete results[0]["NStamina"];
//             delete results[0]["NStrength"];
//             delete results[0]["NPositioning"];
//             res.json({ results: results });
//           } else {
//             delete results[0]["GKPenalties"];
//             delete results[0]["GKDiving"];
//             delete results[0]["GKHandling"];
//             delete results[0]["GKKicking"];
//             delete results[0]["GKPositioning"];
//             delete results[0]["GKReflexes"];
//             res.json({ results: results });
//           }
//         } else {
//           return res.json({ results: [] });
//         }
//       }
//     );
//   } else {
//     return res.json({ results: [] });
//   }
// }

// // ********************************************
// //             SEARCH ROUTES
// // ********************************************

// // Route 7 (handler)
// async function search_matches(req, res) {
//   // TODO: TASK 8: implement and test, potentially writing your own (ungraded) tests
//   // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string
//   const home = req.query.Home;
//   const away = req.query.Away;

//   let query = `SELECT MatchId, Date, Time, HomeTeam AS Home, AwayTeam AS Away, FullTimeGoalsH AS HomeGoals, FullTimeGoalsA AS AwayGoals  
//   FROM Matches`;

//   if (home && !away){
//     query += `\nWHERE HomeTeam like '%${home}%'`;
//   } else if (!home && away){
//     query += `\nWHERE AwayTeam like '%${away}%'`;
//   } else if (!home && !away){
//     // do nothing
//   } else {
//     query += `\nWHERE HomeTeam like '%${home}%'
//         AND AwayTeam like '%${away}%'`;
//   }

//   query += `\nORDER BY HomeTeam, AwayTeam`;

//   if (req.query.page && !isNaN(req.query.page)) {
//     // This is the case where page is defined.
//     // The SQL schema has the attribute OverallRating, but modify it to match spec!
//     // TODO: query and return results here:
//     const pagesize = req.query.pagesize ? req.query.pagesize : 10;
//     const page = req.query.page;
//     connection.query(query,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           filteredResults = [];
//           for (let i = (page - 1) * pagesize; i < page * pagesize; i++) {
//             if (i < results.length) {
//               filteredResults.push(results[i]);
//             }
//           }
//           res.json({ results: filteredResults });
//         }
//       }
//     );
//   } else {
//     // we have implemented this for you to see how to return results by querying the database
//     connection.query(query,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           res.json({ results: results });
//         }
//       }
//     );
//   }
// }

// // Route 8 (handler)
// async function search_players(req, res) {
//   // TODO: TASK 9: implement and test, potentially writing your own (ungraded) tests
//   // IMPORTANT: in your SQL LIKE matching, use the %query% format to match the search query to substrings, not just the entire string

//   const name = req.query.Name;
//   const nationality = req.query.Nationality;
//   const club = req.query.Club;
//   const rating_low = req.query.RatingLow ? req.query.RatingLow : 0;
//   const rating_high = req.query.RatingHigh ? req.query.RatingHigh : 100;
//   const potential_low = req.query.PotentialLow ? req.query.PotentialLow : 0;
//   const potential_high = req.query.PotentialHigh ? req.query.PotentialHigh : 100;
//   const page = req.query.page;
//   const pagesize = req.query.pagesize ? req.query.pagesize : 10;

//   let query = `SELECT PlayerId, Name, Nationality, OverallRating AS Rating, Potential, Club, Value 
//                FROM Players
//                WHERE OverallRating >= ${rating_low}
//                AND OverallRating <= ${rating_high}
//                AND (Potential >= ${potential_low}
//                AND Potential) <= ${potential_high}`;

//   if (name){
//     query += `\nAND Name like '%${name}%'`
//   }
//   if (nationality){
//     query += `\nAND Nationality like '%${nationality}%'`
//   }
//   if (club){
//     query += `\nAND Club like '%${club}%'`
//   }
//   query += `\nORDER BY Name ASC`
//   console.log(query);
//   if (page&& !isNaN(page)) {
//     connection.query(query,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           filteredResults = [];
//           for (let i = (page - 1) * pagesize; i < page * pagesize; i++) {
//             if (i < results.length) {
//               filteredResults.push(results[i]);
//             }
//           }
//           res.json({ results: filteredResults });
//         }
//       }
//     );
//   } else {
//     connection.query(query,
//       function (error, results, fields) {
//         if (error) {
//           console.log(error);
//           res.json({ error: error });
//         } else if (results) {
//           res.json({ results: results });
//         }
//       }
//     );
//   }
// }

module.exports = {
  getMigrations, 
  filterResearchers, 
  filterPaperWords, 
  filterPaperPublication,
  topResearcher,
  getTotalPaperByCountry
};
