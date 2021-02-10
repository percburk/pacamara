const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
  const sqlText = `
    SELECT "coffees".*, "users_coffees".is_fav,
    ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array" 
    FROM "coffees_flavors"
    JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
    WHERE "users_coffees".users_id = $1
    GROUP BY "coffees".id, "users_coffees".is_fav ORDER BY "coffees".date;
  `;

  pool
    .query(sqlText, [req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

router.put('/fav/:id', (req, res) => {
  const sqlText = `
    UPDATE "users_coffees" SET "is_fav" = NOT "is_fav" 
    WHERE "users_id" = $1 AND "coffees_id" = $2;
  `;

  pool
    .query(sqlText, [req.user.id, req.params.id])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(`error in PUT with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

router.delete('/delete/:id', (req, res) => {

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
