const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication.middleware');
const router = express.Router();

// GET route for one coffee for CoffeeDetails
router.get('/:id', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT "coffees".*, "users_coffees".is_fav, "users_coffees".brewing,
    "users_coffees".shared_by_id,
    ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array"
    FROM "coffees_flavors"
    JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
    WHERE "coffees".id = $1 AND "users_coffees".users_id = $2
    GROUP BY "coffees".id, "users_coffees".is_fav, "users_coffees".brewing,
    "users_coffees".shared_by_id;
  `;

  pool
    .query(sqlText, [req.params.id, req.user.id])
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// PUT route to toggle boolean 'fav' or 'brewing' status of a coffee
router.put('/fav-brew', rejectUnauthenticated, (req, res) => {
  const { change, id } = req.body;

  const sqlText = `
    UPDATE "users_coffees" SET "${change}" = NOT "${change}"
    WHERE "users_id" = $1 AND "coffees_id" = $2;
  `;

  pool
    .query(sqlText, [req.user.id, id])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(`Error in PUT with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// PUT route to edit an individual coffee, SQL transaction
router.put('/edit', rejectUnauthenticated, async (req, res) => {
  const connection = await pool.connect();

  try {
    await connection.query('BEGIN;');
    
    // Query #1
    // Updating the data on 'coffees' table
    const updateCoffeeSqlText = `
      UPDATE "coffees" SET "roaster" = $1, "roast_date" = $2, "is_blend" = $3,
      "blend_name" = $4, "country" = $5, "producer" = $6, "region" = $7,
      "elevation" = $8, "cultivars" = $9, "processing" = $10,
      "notes" = $11, "coffee_pic" = $12 WHERE "id" = $13;
    `;

    await connection.query(updateCoffeeSqlText, [
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
    ]);

    // Query #2
    // Deleting old entries in coffees_flavors
    const deleteFlavorsSqlText = `
      DELETE FROM "coffees_flavors" WHERE "coffees_id" = $1;
    `;

    await connection.query(deleteFlavorsSqlText, [req.body.id]);

    // Query #3
    // Adding new flavors to coffees_flavors
    // Build SQL query for each new entry in flavors_array
    let sqlValues = req.body.flavors_array
      .reduce((valString, val, i) => (valString += `($1, $${i + 2}),`), '')
      .slice(0, -1); // Takes off last comma

    const updateFlavorsSqlText = `
      INSERT INTO "coffees_flavors" ("coffees_id", "flavors_id")
      VALUES ${sqlValues};
    `;

    await connection.query(updateFlavorsSqlText, [
      req.body.id,
      ...req.body.flavors_array,
    ]);

    // Query #4
    // Update brewing status of the edited coffee
    const updateBrewingSqlText = `
      UPDATE "users_coffees" SET "brewing" = $1
      WHERE "coffees_id" = $2;
    `;

    await connection.query(updateBrewingSqlText, [
      req.body.brewing,
      req.body.id,
    ]);

    // Complete transaction
    await connection.query('COMMIT;');
    res.sendStatus(201); // Send back success!
  } catch (err) {
    await connection.query('ROLLBACK;');
    console.log('Error in transaction in oneCoffee.router, rollback: ', err);
    res.sendStatus(500);
  } finally {
    connection.release();
  }
});

module.exports = router;
