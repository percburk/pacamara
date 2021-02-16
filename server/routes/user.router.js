const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// GET request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the
  // database)
  res.send(req.user);
});

// GET request for the methods user owns from 'users_methods' junction table
router.get('/methods', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    SELECT ARRAY_AGG("methods_id") FROM "users_methods" WHERE "users_id" = $1;
  `;

  pool
    .query(sqlText, [req.user.id])
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`error in GET with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const sqlText = `
    INSERT INTO "users" ("username", "password")
    VALUES ($1, $2) RETURNING "id";
  `;

  pool
    .query(sqlText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// This middleware will run our POST if successful and will send a 404 if not
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

// Handles adding all other information to 'users', in creating both a new
// profile or updating existing profile, contains 3 SQL queries
router.put('/update', rejectUnauthenticated, (req, res) => {
  const sqlText = `
    UPDATE "users" SET "name" = $1, "profile_pic" = $2, 
    "methods_default_id" = $3, "methods_default_lrr" = $4, "kettle" = $5, 
    "grinder" = $6, "tds_min" = $7, "tds_max" = $8, "ext_min" = $9, 
    "ext_max" = $10 WHERE "id" = $11;
  `;

  // Query #1 - sending all non-array data
  pool
    .query(sqlText, [
      req.body.name,
      req.body.profile_pic,
      req.body.methods_default_id,
      req.body.methods_default_lrr,
      req.body.kettle,
      req.body.grinder,
      req.body.tds_min,
      req.body.tds_max,
      req.body.ext_min,
      req.body.ext_max,
      req.user.id,
    ])
    .then(() => {
      const deleteSqlText = `
        DELETE FROM "users_methods" WHERE "users_id" = $1;
      `;

      // Query #2 - deleting old entries in "users_methods"
      pool
        .query(deleteSqlText, [req.user.id])
        .then(() => {
          // Array of updated methods sent from UpdateProfile
          const newMethods = req.body.methods_array;

          // Loop through array of methods, prepare $'s for query
          let sqlValues = '';
          for (i = 2; i <= newMethods.length + 1; i++) {
            sqlValues += `($1, $${i}),`;
          }
          sqlValues = sqlValues.slice(0, -1); // Takes off last comma

          const methodsSqlText = `
            INSERT INTO "users_methods" ("users_id", "methods_id")
            VALUES ${sqlValues};
          `;

          // Query #3 - Sends newMethods array to "users_methods"
          pool
            .query(methodsSqlText, [req.user.id, ...newMethods])
            .then(() => res.sendStatus(201)) // Send back success!
            .catch((err) => {
              // Catch for Query #3
              console.log(`error in PUT with query ${methodsSqlText}`, err);
              res.sendStatus(500);
            });
        })
        .catch((err) => {
          // Catch for Query #2
          console.log(`error in PUT with query ${deleteSqlText}`, err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      // Catch for Query #1
      console.log(`error in PUT with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

router.put('/image', (req, res) => {
  const sqlText = `UPDATE "users" SET "profile_pic" = $1 WHERE "id" = $2;`;
  pool
    .query(sqlText, [req.body.url, req.user.id])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(`error in PUT with query ${sqlText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
