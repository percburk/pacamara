const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
  const sqlText = `
    SELECT "coffees".id, "coffees".date, "coffees".roaster, "coffees".blend_name, "coffees".country, "coffees".producer, ARRAY_AGG("flavors".id), "users_coffees".is_fav AS "flavors_array" FROM "flavors" JOIN "coffees_flavors" ON "flavors".id = "coffees_flavors".flavors_id JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
    WHERE "users_coffees".users_id = $1 GROUP BY "coffees".id ORDER BY "coffees".date;
  `;

  pool
    .query(sqlText, [req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
