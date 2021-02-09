const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
  const sqlText = `
    SELECT "coffees".id, "coffees".date, "coffees".roaster, "coffees".country,
    "coffees".producer, "coffees".blend_name, "users_coffees".is_fav, 
    ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array" 
    FROM "coffees_flavors" 
    JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
    JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
    WHERE "users_coffees".users_id = $1 GROUP BY "coffees".id 
    ORDER BY "coffees".date;
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
