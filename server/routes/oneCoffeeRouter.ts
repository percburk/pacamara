import camelcaseKeys from 'camelcase-keys';
import express, { Request, Response } from 'express';
import pool from '../modules/pool';
import { PoolClient } from 'pg';
import { rejectUnauthenticated } from '../modules/authenticationMiddleware';
const router = express.Router();

// GET route for one coffee for CoffeeDetails
router.get(
  '/:id',
  rejectUnauthenticated,
  (req: Request, res: Response): void => {
    const sqlText = `
      SELECT "coffees".*, 
             "users_coffees".is_fav, 
             "users_coffees".brewing,
             "users_coffees".shared_by_id,
             ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array"
      FROM "coffees_flavors"
      JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
      JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
      WHERE "coffees".id = $1 AND "users_coffees".users_id = $2
      GROUP BY "coffees".id, 
               "users_coffees".is_fav, 
               "users_coffees".brewing,
               "users_coffees".shared_by_id;
    `;

    pool
      .query(sqlText, [req.params.id, req.user?.id])
      .then((result) => res.send(camelcaseKeys(result.rows)))
      .catch((err) => {
        console.log(`Error in GET with query: ${sqlText}`, err);
        res.sendStatus(500);
      });
  }
);

// PUT route to toggle boolean 'fav' or 'brewing' status of a coffee
router.put(
  '/fav-brew',
  rejectUnauthenticated,
  (req: Request, res: Response): void => {
    const { change, id: coffeeId }: { change: string; id: number } = req.body;
    const sqlChange: string = change === 'fav' ? 'is_fav' : 'brewing';

    const sqlText = `
      UPDATE "users_coffees" 
      SET "${sqlChange}" = NOT "${sqlChange}"
      WHERE "users_id" = $1 AND "coffees_id" = $2;
    `;

    pool
      .query(sqlText, [req.user?.id, coffeeId])
      .then(() => res.sendStatus(201))
      .catch((err) => {
        console.log(`Error in PUT with query: ${sqlText}`, err);
        res.sendStatus(500);
      });
  }
);

// PUT route to edit an individual coffee, transaction
router.put(
  '/edit',
  rejectUnauthenticated,
  async (req: Request, res: Response): Promise<void> => {
    const connection: PoolClient = await pool.connect();

    try {
      await connection.query('BEGIN;');

      // Query #1
      // Updating the data on 'coffees' table
      const updateCoffeeSqlText = `
        UPDATE "coffees" 
        SET "roaster" = $1, 
            "roast_date" = $2, 
            "is_blend" = $3,
            "blend_name" = $4, 
            "country" = $5, 
            "producer" = $6, 
            "region" = $7,
            "elevation" = $8, 
            "cultivars" = $9, 
            "processing" = $10,
            "notes" = $11, 
            "coffee_pic" = $12 
        WHERE "id" = $13;
      `;

      await connection.query(updateCoffeeSqlText, [
        req.body.roaster,
        req.body.roastDate,
        req.body.isBlend,
        req.body.blendName,
        req.body.country,
        req.body.producer,
        req.body.region,
        req.body.elevation,
        req.body.cultivars,
        req.body.processing,
        req.body.notes,
        req.body.coffeePic,
        req.body.id,
      ]);

      // Query #2
      // Deleting old entries in coffees_flavors
      const deleteFlavorsSqlText = `
        DELETE FROM "coffees_flavors" WHERE "coffees_id" = $1;
      `;

      await connection.query(deleteFlavorsSqlText, [req.body.id]);

      // Query #3
      // Adding new flavors to coffees_flavors
      // Build SQL query for each new entry in flavors_array
      let sqlValues = req.body.flavorsArray
        .reduce(
          (valString: string, _: number, i: number) =>
            (valString += `($1, $${i + 2}),`),
          ''
        )
        .slice(0, -1); // Takes off last comma

      const updateFlavorsSqlText = `
        INSERT INTO "coffees_flavors" ("coffees_id", "flavors_id")
        VALUES ${sqlValues};
      `;

      await connection.query(updateFlavorsSqlText, [
        req.body.id,
        ...req.body.flavorsArray,
      ]);

      // Query #4
      // Update brewing status of the edited coffee
      const updateBrewingSqlText = `
        UPDATE "users_coffees" 
        SET "brewing" = $1 
        WHERE "coffees_id" = $2;
      `;

      await connection.query(updateBrewingSqlText, [
        req.body.brewing,
        req.body.id,
      ]);

      // Complete transaction
      await connection.query('COMMIT;');
      res.sendStatus(201); // Send back success!
    } catch (err) {
      await connection.query('ROLLBACK;');
      console.log('Error in transaction in oneCoffee.router, rollback: ', err);
      res.sendStatus(500);
    } finally {
      connection.release();
    }
  }
);

export default router;
