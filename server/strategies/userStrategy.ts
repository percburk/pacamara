import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import camelcaseKeys from 'camelcase-keys';
import { comparePassword } from '../modules/encryption';
import pool from '../modules/pool';

passport.serializeUser((user, done): void => {
  const { id } = user as Express.User;
  done(null, id);
});

passport.deserializeUser((id: number, done): void => {
  const sqlText = `
    SELECT * FROM "users" 
    WHERE "id" = $1;
  `;

  pool
    .query(sqlText, [id])
    .then((result) => {
      // Handle Errors
      const user = result?.rows?.[0];

      if (user) {
        // user found
        delete user.password; // remove password so it doesn't get sent
        // done takes an error (null in this case) and a user
        done(null, camelcaseKeys(user));
      } else {
        // user not found
        // done takes an error (null in this case) and a user (also null in this case)
        // this will result in the server returning a 401 status code
        done(null, null);
      }
    })
    .catch((err) => {
      console.log('Error in user.strategy in deserializing user: ', err);
      // done takes an error (we have one) and a user (null in this case)
      // this will result in the server returning a 500 status code
      done(err, null);
    });
});

// Does actual work of logging in
passport.use(
  'local',
  new LocalStrategy((username: string, password: string, done): void => {
    const sqlText = `
      SELECT * FROM "users" 
      WHERE "username" = $1;
    `;

    pool
      .query(sqlText, [username])
      .then((result) => {
        const user = result?.rows?.[0];

        if (user && comparePassword(password, user.password)) {
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
        console.log('Error in user.strategy in logging in user: ', err);
        // done takes an error (we have one) and a user (null in this case)
        // this will result in the server returning a 500 status code
        done(err, null);
      });
  })
);

export default passport;
