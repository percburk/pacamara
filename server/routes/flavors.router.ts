import express, { Request, Response } from 'express';
import pool from '../modules/pool';
const router = express.Router();

// GET route for list of flavors, displayed as Chips throughout the app
router.get('/', (req: Request, res: Response): void => {
  const sqlText: string = `
    SELECT * FROM "flavors" ORDER BY "flavors".name;
  `;

  pool
    .query(sqlText)
    .then((response) => res.send(response.rows))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

export default router;
