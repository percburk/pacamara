const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication.middleware');
const router = express.Router();

// GET request for user list to share coffees with
router.get('/users', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT "id", "username", "name", "profile_pic" 
    FROM "users" WHERE "id" != $1;
  `;

  pool
    .query(sqlText, [req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

router.post('/', rejectUnauthenticated, (req, res) => {
  const { recipient_id, coffees_id, coffee_name, message } = req.body;

  const sqlText = `
    INSERT INTO "shared_coffees" ("sender_id", "username", "profile_pic", "recipient_id",
    "coffees_id", "coffee_name", "message")
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;

  pool
    .query(sqlText, [
      req.user.id,
      req.user.username,
      req.user.profile_pic,
      recipient_id,
      coffees_id,
      coffee_name,
      message,
    ])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log(`error in POST with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

router.get('/', (req, res) => {
  const sqlText = `SELECT * FROM "shared_coffees" WHERE "recipient_id" = $1;`;

  pool
    .query(sqlText, [req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// GET route for one coffee for CoffeeDetails
router.get('/:id', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT "coffees".*, 
    ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array"
    FROM "coffees_flavors"
    JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    WHERE "coffees".id = $1
    GROUP BY "coffees".id;
  `;

  pool
    .query(sqlText, [req.params.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
