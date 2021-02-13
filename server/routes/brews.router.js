const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

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

router.put('/fav/:id', (req, res) => {
  const sqlText = `
    UPDATE "brews" SET "is_fav" = NOT "is_fav" WHERE "id" = $1;
  `;

  pool
    .query(sqlText, [req.params.id])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(`error in PUT with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

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
