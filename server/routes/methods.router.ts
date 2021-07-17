import express, { Request, Response } from 'express';
import pool from '../modules/pool';
const router = express.Router();

// GET route for list of methods
router.get('/', (req: Request, res: Response): void => {
  const sqlText: string = `
    SELECT * FROM "methods" ORDER BY "methods".name;
  `;

  pool
    .query(sqlText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err);
      res.sendStatus(500);
    });
});

export default router;
