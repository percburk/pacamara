import { Router } from 'express'
import { rejectUnauthenticated } from '../modules/authenticationMiddleware'
import { pool } from '../modules/pool'

const flavorsRouter = Router()

// GET route for list of flavors, displayed as Chips throughout the app
flavorsRouter.get('/', rejectUnauthenticated, (_, res) => {
  const sqlText = `
    SELECT * FROM "flavors"
    ORDER BY "flavors".name;
  `

  pool
    .query(sqlText)
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.log(`Error in GET with query: ${sqlText}`, err)
      res.sendStatus(500)
    })
})

export { flavorsRouter }
