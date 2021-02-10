const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Get all info from 'users' table along with array of brew methods
  const sqlText = `
    SELECT "users".*, ARRAY_AGG("users_methods".methods_id) AS "methods_array" FROM "users" JOIN "users_methods" ON "users".id = "users_methods".users_id
    WHERE "users".id = $1 GROUP BY "users".id;
  `;

  pool
    .query(sqlText, [id])
    .then((result) => {
      // Handle Errors
      const user = result && result.rows && result.rows[0];

      if (user) {
        // user found
        delete user.password; // remove password so it doesn't get sent
        // done takes an error (null in this case) and a user
        done(null, user);
      } else {
        // user not found
        // done takes an error (null in this case) and a user (also null in this case)
        // this will result in the server returning a 401 status code
        done(null, null);
      }
    })
    .catch((err) => {
      console.log('Error with query during deserializing user ', err);
      // done takes an error (we have one) and a user (null in this case)
      // this will result in the server returning a 500 status code
      done(err, null);
    });
});

// Does actual work of logging in
passport.use(
  'local',
  new LocalStrategy((username, password, done) => {
    pool
      .query('SELECT * FROM "users" WHERE "username" = $1', [username])
      .then((result) => {
        const user = result && result.rows && result.rows[0];
        if (user && encryptLib.comparePassword(password, user.password)) {
          // All good! Passwords match!
          // done takes an error (null in this case) and a user
          done(null, user);
        } else {
          // Not good! Username and password do not match.
          // done takes an error (null in this case) and a user (also null in this case)
          // this will result in the server returning a 401 status code
          done(null, null);
        }
      })
      .catch((err) => {
        console.log('Error with query for user ', err);
        // done takes an error (we have one) and a user (null in this case)
        // this will result in the server returning a 500 status code
        done(err, null);
      });
  })
);

module.exports = passport;
