import camelcaseKeys from 'camelcase-keys';
import express, { Request, Response } from 'express';
import pool from '../modules/pool';
import { rejectUnauthenticated } from '../modules/authenticationMiddleware';
const router = express.Router();

// GET route for user list to share coffees with
router.get(
  '/users',
  rejectUnauthenticated,
  (req: Request, res: Response): void => {
    const sqlText = `
      SELECT "id", "username", "name", "profile_pic" 
      FROM "users" WHERE "id" != $1;
    `;

    pool
      .query(sqlText, [req.user?.id])
      .then((result) => res.send(camelcaseKeys(result.rows)))
      .catch((err) => {
        console.log(`Error in GET with query: ${sqlText}`, err);
        res.sendStatus(500);
      });
  }
);

// GET route for a list of any coffees that have been shared with current user
router.get('/', (req: Request, res: Response): void => {
  const sqlText = `SELECT * FROM "shared_coffees" WHERE "recipient_id" = $1;`;

  pool
    .query(sqlText, [req.user?.id])
    .then((result) => res.send(camelcaseKeys(result.rows)))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// GET route for one coffee to display on SharedCoffeeDialog
router.get(
  '/:id',
  rejectUnauthenticated,
  (req: Request, res: Response): void => {
    const sqlText = `
      SELECT "coffees".*, 
        ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array"
      FROM "coffees_flavors"
      JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
      WHERE "coffees".id = $1
      GROUP BY "coffees".id;
    `;

    pool
      .query(sqlText, [req.params.id])
      .then((result) => res.send(camelcaseKeys(result.rows)))
      .catch((err) => {
        console.log(`Error in GET with query: ${sqlText}`, err);
        res.sendStatus(500);
      });
  }
);

// POST route to share a coffee with another user
router.post('/', rejectUnauthenticated, (req: Request, res: Response): void => {
  const { recipientId, coffeesId, coffeeName, message } = req.body;

  const sqlText = `
    INSERT INTO "shared_coffees" (
      "sender_id", 
      "username", 
      "profile_pic", 
      "recipient_id", 
      "coffees_id", 
      "coffee_name", 
      "message"
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;
  console.log(
    req.user?.id,
    req.user?.username,
    req.user?.profilePic,
    recipientId,
    coffeesId,
    coffeeName,
    message
  );

  pool
    .query(sqlText, [
      req.user?.id,
      req.user?.username,
      req.user?.profilePic,
      recipientId,
      coffeesId,
      coffeeName,
      message,
    ])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log(`Error in POST with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// POST route to add a shared coffee to the user's dashboard
router.post('/add', (req: Request, res: Response): void => {
  const { coffees_id, shared_by_id } = req.body;

  const sqlText = `
    INSERT INTO "users_coffees" ("users_id", "coffees_id", "shared_by_id") 
    VALUES ($1, $2, $3);
  `;

  pool
    .query(sqlText, [req.user?.id, coffees_id, shared_by_id])
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.log(`Error in POST with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

// DELETE route that deletes the entry from "shared_coffees" when
// a user declines to add a shared coffee to their dashboard
router.delete('/delete/:id', (req: Request, res: Response): void => {
  const sqlText = `DELETE FROM "shared_coffees" WHERE "id" = $1;`;

  pool
    .query(sqlText, [req.params.id])
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.log(`Error in DELETE with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

export default router;
