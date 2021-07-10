const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET route for list of flavors, displayed as Chips throughout the app
router.get('/', (req, res) => {
  const sqlText = `
    SELECT * FROM "flavors" ORDER BY "flavors".name;
  `;

  pool
    .query(sqlText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;