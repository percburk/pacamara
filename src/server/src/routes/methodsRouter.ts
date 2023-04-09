import camelcaseKeys from 'camelcase-keys'
import { Router, Request, Response } from 'express'
import { rejectUnauthenticated } from '../modules/authenticationMiddleware'
import pool from '../modules/pool'

const router = Router()

// GET route for list of methods
router.get('/', rejectUnauthenticated, (_: Request, res: Response): void => {
  const sqlText = `
    SELECT * FROM "methods" 
    ORDER BY "methods".name;
  `

  pool
    .query(sqlText)
    .then((result) => res.send(camelcaseKeys(result.rows)))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err)
      res.sendStatus(500)
    })
})

export default router
