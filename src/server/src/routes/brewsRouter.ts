import camelcaseKeys from 'camelcase-keys'
import { Router } from 'express'
import { TypedRequest } from '../models/expressResource'
import { Brew, BrewLikeStatus } from '../models/modelResource'
import { rejectUnauthenticated } from '../modules/authenticationMiddleware'
import { pool } from '../modules/pool'

const brewsRouter = Router()

// GET route to grab all brew instances for a coffee
brewsRouter.get('/:id', rejectUnauthenticated, async (req, res) => {
  const sqlText = `
      SELECT * FROM "brews"
      WHERE "coffees_id" = $1 
      ORDER BY "date" DESC;
    `
  try {
    const result = await pool.query(sqlText, [req.params.id])
    res.send(camelcaseKeys(result.rows))
  } catch (err) {
    console.log(`Error in GET with query: ${sqlText}`, err)
    res.sendStatus(500)
  }
})

// POST route to add new brew instances to a coffee
brewsRouter.post(
  '/add',
  rejectUnauthenticated,
  async (req: TypedRequest<Brew>, res) => {
    const sqlText = `
      INSERT INTO "brews" (
        "coffees_id", 
        "methods_id", 
        "water_dose", 
        "coffee_dose", 
        "grind", 
        "moisture", 
        "co2", 
        "ratio", 
        "tds", 
        "ext", 
        "water_temp", 
        "time", 
        "lrr",
        "date"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW());
    `

    try {
      await pool.query(sqlText, [
        req.body.coffeesId,
        req.body.methodsId,
        req.body.waterDose,
        req.body.coffeeDose,
        req.body.grind,
        req.body.moisture,
        req.body.co2,
        req.body.ratio,
        req.body.tds,
        req.body.ext,
        req.body.waterTemp,
        req.body.time,
        req.body.lrr,
      ])
      res.sendStatus(200)
    } catch (err) {
      console.log(`Error in POST with query: ${sqlText}`, err)
      res.sendStatus(500)
    }
  }
)

// PUT route to update a brew instance
brewsRouter.put(
  '/edit',
  rejectUnauthenticated,
  async (req: TypedRequest<Brew>, res) => {
    const sqlText = `
      UPDATE "brews" 
      SET "coffees_id" = $1, 
          "methods_id" = $2, 
          "water_dose" = $3, 
          "coffee_dose" = $4, 
          "grind" = $5, 
          "moisture" = $6, 
          "co2" = $7, 
          "ratio" = $8, 
          "tds" = $9, 
          "ext" = $10, 
          "water_temp" = $11, 
          "time" = $12, 
          "lrr" = $13
      WHERE "id" = $14;
    `

    try {
      await pool.query(sqlText, [
        req.body.coffeesId,
        req.body.methodsId,
        req.body.waterDose,
        req.body.coffeeDose,
        req.body.grind,
        req.body.moisture,
        req.body.co2,
        req.body.ratio,
        req.body.tds,
        req.body.ext,
        req.body.waterTemp,
        req.body.time,
        req.body.lrr,
        req.body.id,
      ])
      res.sendStatus(201)
    } catch (err) {
      console.log(`Error in PUT with query: ${sqlText}`, err)
      res.sendStatus(500)
    }
  }
)

// PUT route to change the status of 'liked' on a brew instance
// Can be 'yes', 'no', or 'none'
brewsRouter.patch('/like/:id', async (req: TypedRequest<BrewLikeStatus>, res) => {
  const { change } = req.body
  const newStatus = change === 'yes' ? 'no' : change === 'no' ? 'none' : 'yes'

  const sqlText = `
      UPDATE "brews" 
      SET "liked" = $1 
      WHERE "id" = $2;
    `

  try {
    await pool.query(sqlText, [newStatus, req.params.id])
    res.sendStatus(201)
  } catch (err) {
    console.log(`Error in PUT with query: ${sqlText}`, err)
    res.sendStatus(500)
  }
})

// DELETE a brew instance
brewsRouter.delete('/delete/:id', async (req, res) => {
  const sqlText = `
    DELETE FROM "brews"
    WHERE "id" = $1;
  `
  try {
    await pool.query(sqlText, [req.params.id])
    res.sendStatus(204)
  } catch (err) {
    console.log(`Error in DELETE with query: ${sqlText}`, err)
    res.sendStatus(500)
  }
})

export { brewsRouter }
