const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication.middleware');
const router = express.Router();

// GET route to grab all brew instances for a coffee
router.get('/:id', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT * FROM "brews" WHERE "coffees_id" = $1 ORDER BY "date" DESC;
  `;

  pool
    .query(sqlText, [req.params.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// POST route to add new brew instances to a coffee
router.post('/add', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    INSERT INTO "brews" ("coffees_id", "methods_id", "water_dose", 
    "coffee_dose", "grind", "moisture", "co2", "ratio", "tds", "ext", 
    "water_temp", "time", "lrr")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
  `;

  pool
    .query(sqlText, [
      req.body.coffees_id,
      req.body.methods_id,
      req.body.water_dose,
      req.body.coffee_dose,
      req.body.grind,
      req.body.moisture,
      req.body.co2,
      req.body.ratio,
      req.body.tds,
      req.body.ext,
      req.body.water_temp,
      req.body.time,
      req.body.lrr,
    ])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log(`error in POST with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// PUT route to change the status of 'liked' on a brew instance
// Can be 'yes', 'no', or 'none'
router.put('/like/:id', (req, res) => {
  const sqlText = `
    UPDATE "brews" SET "liked" = $1 WHERE "id" = $2;
  `;

  pool
    .query(sqlText, [req.body.status, req.params.id])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(`error in PUT with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// DELETE a brew instance
router.delete('/delete/:id', (req, res) => {
  const sqlText = `DELETE FROM "brews" WHERE "id" = $1;`;

  pool
    .query(sqlText, [req.params.id])
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.log(`error in DELETE with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
