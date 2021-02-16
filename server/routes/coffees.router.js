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

// POST route for adding a new coffee, this contains 3 SQL queries
router.post('/add', rejectUnauthenticated, (req, res) => {
  const sqlTextNewCoffee = `
    INSERT INTO "coffees" ("roaster", "roast_date", "is_blend", "blend_name", 
    "country", "producer", "region", "elevation", "cultivars", "processing", 
    "notes", "coffee_pic")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING "id";
  `;

  // Query #1 - Create new coffee entry in "coffees", return ID for flavors
  pool
    .query(sqlTextNewCoffee, [
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
    ])
    .then((result) => {
      const newCoffeeId = result.rows[0].id; // New ID is here

      // Add entry to "users_coffees" to pair coffee with current user
      const sqlTextUsersCoffees = `
        INSERT INTO "users_coffees" ("coffees_id", "users_id", "brewing")
        VALUES ($1, $2, $3);
      `;

      // Query #2 - send entry to "users_coffees"
      pool
        .query(sqlTextUsersCoffees, [
          newCoffeeId,
          req.user.id,
          req.body.brewing,
        ])
        .then(() => {
          const flavorsArray = req.body.flavors_array;

          // Loop through flavors to create enough $'s for query
          let sqlValues = '';
          for (i = 2; i <= flavorsArray.length + 1; i++) {
            sqlValues += `($1, $${i}),`;
          }
          sqlValues = sqlValues.slice(0, -1); // Takes off last comma

          // Build query with loop contents
          const sqlTextNewFlavors = `
            INSERT INTO "coffees_flavors" ("coffees_id", "flavors_id")
            VALUES ${sqlValues};
          `;

          // Query #3 - send new values to "coffees_flavors"
          pool
            .query(sqlTextNewFlavors, [newCoffeeId, ...flavorsArray])
            .then(() => res.sendStatus(201)) // Send back success
            .catch((err) => {
              // Catch for Query #3
              console.log(`error in POST with query ${sqlTextNewFlavors}`, err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          // Catch for Query #2
          console.log(`error in POST with query ${sqlTextUsersCoffees}`, err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      // Catch for Query #1
      console.log(`error in POST with query ${sqlTextNewCoffee}`, err);
      res.sendStatus(500);
    });
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
