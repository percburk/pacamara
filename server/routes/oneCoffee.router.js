const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

// GET route for one coffee for CoffeeDetails
router.get('/:id', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT "coffees".*, "users_coffees".is_fav, "users_coffees".brewing,
    ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array"
    FROM "coffees_flavors"
    JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
    WHERE "coffees".id = $1
    GROUP BY "coffees".id, "users_coffees".is_fav, "users_coffees".brewing;
  `;

  pool
    .query(sqlText, [req.params.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// PUT route to toggle Favorite or Brewing status of a coffee
router.put('/favBrew', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    UPDATE "users_coffees" SET ${req.body.change} = NOT ${req.body.change}
    WHERE "users_id" = $1 AND "coffees_id" = $2;
  `;

  pool
    .query(sqlText, [req.user.id, req.body.id])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(`error in PUT with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// PUT route to edit an individual coffee
router.put('/edit', rejectUnauthenticated, (req, res) => {
  const sqlTextUpdateCoffee = `
    UPDATE "coffees" SET "roaster" = $1, "roast_date" = $2, "is_blend" = $3, 
    "blend_name" = $4, "country" = $5, "producer" = $6, "region" = $7, 
    "elevation" = $8, "cultivars" = $9, "processing" = $10, 
    "notes" = $11, "coffee_pic" = $12 WHERE "id" = $13;
  `;

  // Query #1 - Updating the data on 'coffees' table
  pool
    .query(sqlTextUpdateCoffee, [
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
      req.body.id,
    ])
    .then(() => {
      const sqlTextDeleteFlavors = `
        DELETE FROM "coffees_flavors" WHERE "coffees_id" = $1;
      `;

      // Query #2 - deleting old entries in 'coffees_flavors'
      pool
        .query(sqlTextDeleteFlavors, [req.body.id])
        .then(() => {
          const flavorsArray = req.body.flavors_array;

          // Loop through flavors to create enough $'s for query
          let sqlValues = '';
          for (i = 2; i <= flavorsArray.length + 1; i++) {
            sqlValues += `($1, $${i}),`;
          }
          sqlValues = sqlValues.slice(0, -1); // Takes off last comma

          // Build query with loop contents
          const sqlTextUpdateFlavors = `
            INSERT INTO "coffees_flavors" ("coffees_id", "flavors_id")
            VALUES ${sqlValues};
          `;

          // Query #3 - inserting new flavors in 'flavors_coffees'
          pool
            .query(sqlTextUpdateFlavors, [req.body.id, ...flavorsArray])
            .then(() => res.sendStatus(201)) // Send back success!
            .catch((err) => {
              // Catch for Query #3
              console.log(
                `error in PUT with query ${sqlTextUpdateFlavors}`,
                err
              );
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          // Catch for Query #2
          console.log(`error in PUT with query ${sqlTextDeleteFlavors}`, err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      // Catch for Query #1
      console.log(`error in PUT with query ${sqlTextUpdateCoffee}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
