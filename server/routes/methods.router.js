const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET route for list of methods
router.get('/', (req, res) => {
  const sqlText = `
    SELECT * FROM "methods" ORDER BY "methods".name;
  `;
  
  pool
    .query(sqlText)
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
