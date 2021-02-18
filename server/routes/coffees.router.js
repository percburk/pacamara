const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication.middleware');
const router = express.Router();

// GET route for all the user's coffees
router.get('/', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT "coffees".*, "users_coffees".is_fav, "users_coffees".brewing,
    ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array" 
    FROM "coffees_flavors"
    JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
    WHERE "users_coffees".users_id = $1
    GROUP BY "coffees".id, "users_coffees".is_fav, "users_coffees".brewing
    ORDER BY "coffees".date DESC;
  `;

  pool
    .query(sqlText, [req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// GET route for search results
router.get('/searchResults', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT "coffees".*, "users_coffees".is_fav, "users_coffees".brewing,
    ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array" 
    FROM "coffees_flavors"
    JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id 
    WHERE to_tsvector(CONCAT_WS(' ', "coffees".roaster, 
    "coffees".country, "coffees".producer, "coffees".blend_name))
    @@ to_tsquery($1) AND "users_coffees".users_id = $2
    GROUP BY "coffees".id, "users_coffees".is_fav, "users_coffees".brewing
    ORDER BY "coffees".date DESC;
  `;

  // '"Sweet&Bloom&Hometown&Blend":*' - This is the wanted end query result
  // Outer single quotes get added when the query is sanitized using '$1'
  const parsedQuery = `"${req.query.string.replace(/\s/g, '&')}":*`;

  pool
    .query(sqlText, [parsedQuery, req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// GET route for search drop down
router.get('/search', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT "coffees".country, "coffees".producer, "coffees".roaster, 
    "coffees".blend_name, "users_coffees".users_id FROM "coffees"
    JOIN "users_coffees" ON "users_coffees".coffees_id = "coffees".id
    WHERE "users_coffees".users_id = $1 ORDER BY "coffees".date DESC;
  `;

  pool
    .query(sqlText, [req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// POST route for adding a new coffee, this contains 3 SQL queries
router.post('/add', rejectUnauthenticated, async (req, res) => {
  const connection = await pool.connect();

  try {
    // Query #1 - Create new coffee entry in "coffees", return ID for flavors
    const newCoffeeSqlText = `
      INSERT INTO "coffees" ("roaster", "roast_date", "is_blend", "blend_name", 
      "country", "producer", "region", "elevation", "cultivars", "processing", 
      "notes", "coffee_pic")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING "id";
    `;
    const response = await pool.query(newCoffeeSqlText, [
      req.body.roaster,
      req.body.roast_date,
      req.body.is_blend,
      req.body.blend_name,
      req.body.country,
      req.body.producer,
      req.body.region,
      req.body.elevation,
      req.body.cultivars,
      req.body.processing,
      req.body.notes,
      req.body.coffee_pic,
    ]);

    // Query #2 - add entry to "users_coffees" to pair coffee with current user
    const newCoffeeId = response.rows[0].id; // New ID is here
    const usersCoffeesSqlText = `
      INSERT INTO "users_coffees" ("coffees_id", "users_id", "brewing")
      VALUES ($1, $2, $3);
    `;
    await pool.query(usersCoffeesSqlText, [
      newCoffeeId,
      req.user.id,
      req.body.brewing,
    ]);

    // Query #3 - adding new flavors to coffees_flavors
    // Build SQL query for each new entry in flavors_array
    let sqlValues = req.body.flavors_array
      .reduce((sqlValString, val, i) => {
        return (sqlValString += `($1, $${i + 2}),`);
      }, '')
      .slice(0, -1); // Takes off last comma
    const newFlavorsSqlText = `
      INSERT INTO "coffees_flavors" ("coffees_id", "flavors_id")
      VALUES ${sqlValues};
    `;
    pool.query(newFlavorsSqlText, [newCoffeeId, ...req.body.flavors_array]);

    // Complete transaction
    await connection.query('COMMIT;');
    res.sendStatus(201); // Send back success!
  } catch (err) {
    await connection.query('ROLLBACK;');
    console.log('error in PUT transaction in coffees.router, rollback', err);
    res.sendStatus(500);
  } finally {
    connection.release();
  }
});

// DELETE route for a coffee from their dashboard
router.delete('/delete/:id', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    DELETE FROM "users_coffees" WHERE "users_id" = $1 AND "coffees_id" = $2;
  `;

  pool
    .query(sqlText, [req.user.id, req.params.id])
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.log(`error in DELETE with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
