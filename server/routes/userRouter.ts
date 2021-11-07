import camelcaseKeys from 'camelcase-keys';
import express, { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { rejectUnauthenticated } from '../modules/authenticationMiddleware';
import { encryptPassword } from '../modules/encryption';
import pool from '../modules/pool';
import userStrategy from '../strategies/userStrategy';
const router = express.Router();

// GET request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req: Request, res: Response): void => {
  // Send back user object from session, previously queried from the database
  res.send(req.user);
});

// GET request for the methods user owns from "users_methods" junction table
router.get(
  '/methods',
  rejectUnauthenticated,
  (req: Request, res: Response): void => {
    const sqlText = `
      SELECT ARRAY_AGG("methods_id") 
      FROM "users_methods" 
      WHERE "users_id" = $1;
    `;

    pool
      .query(sqlText, [req.user?.id])
      .then((result) => res.send(camelcaseKeys(result.rows, { deep: true })))
      .catch((err) => {
        console.log(`Error in GET with query: ${sqlText}`, err);
        res.sendStatus(500);
      });
  }
);

// Handles POST request with new user data, the password gets encrypted
router.post('/register', (req: Request, res: Response): void => {
  const username: string | null = req.body.username;
  const password: string | null = encryptPassword(req.body.password);

  const sqlText = `
    INSERT INTO "users" ("username", "password")
    VALUES ($1, $2) RETURNING "id";
  `;

  pool
    .query(sqlText, [username, password])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log('Error in POST in user registration: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// This middleware will run our POST if successful and will send a 404 if not
router.post(
  '/login',
  userStrategy.authenticate('local'),
  (req: Request, res: Response): void => {
    res.sendStatus(200);
  }
);

// Clear all server session information about this user
router.post('/logout', (req: Request, res: Response): void => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

// PUT route adding all other information to 'users', in creating both a
// new profile or updating existing profile, transaction
router.put(
  '/update',
  rejectUnauthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const connection: PoolClient = await pool.connect();

    try {
      await connection.query('BEGIN;');

      // Query #1 - sending all non-array user data
      const updateSqlText = `
      UPDATE "users" 
      SET "name" = $1, 
          "profile_pic" = $2, 
          "methods_default_id" = $3, 
          "methods_default_lrr" = $4, 
          "kettle" = $5, 
          "grinder" = $6, 
          "tds_min" = $7, 
          "tds_max" = $8, 
          "ext_min" = $9, 
          "ext_max" = $10 
      WHERE "id" = $11;
    `;
      await connection.query(updateSqlText, [
        req.body.name,
        req.body.profilePic,
        req.body.methodsDefaultId,
        req.body.methodsDefaultLrr,
        req.body.kettle,
        req.body.grinder,
        req.body.tdsMin,
        req.body.tdsMax,
        req.body.extMin,
        req.body.extMax,
        req.user?.id,
      ]);

      // Query #2 - deleting old entries in users_methods
      const deleteSqlText = `
        DELETE FROM "users_methods" 
        WHERE "users_id" = $1;
      `;
      await connection.query(deleteSqlText, [req.user?.id]);

      // Query #3, go through methods_array to build query to insert
      // into users_methods
      let sqlValues = req.body.methodsArray
        .reduce(
          (valString: string, _: number, i: number) =>
            (valString += `($1, $${i + 2}),`),
          ''
        )
        .slice(0, -1); // Takes off last comma

      const methodsSqlText = `
        INSERT INTO "users_methods" ("users_id", "methods_id")
        VALUES ${sqlValues};
      `;
      await connection.query(methodsSqlText, [
        req.user?.id,
        ...req.body.methodsArray,
      ]);

      // Complete transaction
      await connection.query('COMMIT;');
      res.sendStatus(201); // Send back success!
    } catch (err) {
      await connection.query('ROLLBACK;');
      console.log('Error in PUT transaction in user.router, rollback: ', err);
      res.sendStatus(500);
    } finally {
      connection.release();
    }
  }
);

export default router;
