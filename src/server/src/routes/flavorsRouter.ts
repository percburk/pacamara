import { Router, Request, Response } from 'express'
import pool from '../modules/pool'

const router = Router()

// GET route for list of flavors, displayed as Chips throughout the app
router.get('/', (_: Request, res: Response): void => {
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

export default router
