import camelcaseKeys from 'camelcase-keys'
import { Router } from 'express'
import { TypedRequest } from '../models/expressResource'
import { CoffeeItem } from '../models/modelResource'
import { rejectUnauthenticated } from '../modules/authenticationMiddleware'
import { pool } from '../modules/pool'

const coffeesRouter = Router()

// GET route for all the user's coffees, called conditionally in coffees.saga
coffeesRouter.get('/', rejectUnauthenticated, async (req, res) => {
  const sqlText = `
    SELECT "coffees".*, 
           "users_coffees".is_fav, 
           "users_coffees".brewing, 
           "users_coffees".shared_by_id,
           ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array"
    FROM "coffees_flavors"
      RIGHT JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
      JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id
    WHERE "users_coffees".users_id = $1
    GROUP BY "coffees".id, 
             "users_coffees".is_fav, 
             "users_coffees".brewing,
             "users_coffees".shared_by_id
    ORDER BY "coffees".date DESC;
  `
  try {
    const result = await pool.query(sqlText, [req.user?.id])
    res.send(camelcaseKeys(result.rows))
  } catch (err) {
    console.log(`Error in GET with query: ${sqlText}`, err)
    res.sendStatus(500)
  }
})

// GET route for search results, called conditionally in coffees.saga
coffeesRouter.get('/search-results', rejectUnauthenticated, async (req, res) => {
  const { q } = req.query

  const sqlText = `
      SELECT "coffees".*, 
             "users_coffees".is_fav, 
             "users_coffees".brewing,
             "users_coffees".shared_by_id,
             ARRAY_AGG("coffees_flavors".flavors_id) AS "flavors_array" 
      FROM "coffees_flavors"
        RIGHT JOIN "coffees" ON "coffees_flavors".coffees_id = "coffees".id
        JOIN "users_coffees" ON "coffees".id = "users_coffees".coffees_id 
      WHERE to_tsvector(CONCAT_WS(
          ' ', 
          "coffees".roaster, 
          "coffees".country, 
          "coffees".producer, 
          "coffees".blend_name
        ))
        @@ to_tsquery($1) 
        AND "users_coffees".users_id = $2
      GROUP BY "coffees".id, 
               "users_coffees".is_fav, 
               "users_coffees".brewing,
               "users_coffees".shared_by_id
      ORDER BY "coffees".date DESC;
    `

  // '"Sweet&Bloom&Hometown&Blend":*' - This is the wanted end query result
  // Outer single quotes get added when the query is sanitized using $1
  // Also need to remove any '& ' characters already present for to_tsvector
  const parsedQuery = `"${(q as string).replace('& ', '').replace(/\s/g, '&')}":*`

  try {
    const result = await pool.query(sqlText, [parsedQuery, req.user?.id])
    res.send(camelcaseKeys(result.rows))
  } catch (err) {
    console.log(`Error in GET with query: ${sqlText}`, err)
    res.sendStatus(500)
  }
})

// GET route of pared down coffee info for search Autocomplete menu
coffeesRouter.get('/search', rejectUnauthenticated, async (req, res) => {
  const sqlText = `
      SELECT "coffees".country, 
             "coffees".producer, 
             "coffees".roaster, 
             "coffees".blend_name, 
             "users_coffees".users_id 
      FROM "coffees"
        JOIN "users_coffees" ON "users_coffees".coffees_id = "coffees".id
      WHERE "users_coffees".users_id = $1 
      ORDER BY "coffees".date DESC;
    `

  try {
    const result = await pool.query(sqlText, [req.user?.id])
    res.send(camelcaseKeys(result.rows))
  } catch (err) {
    console.log(`Error in GET with query: ${sqlText}`, err)
    res.sendStatus(500)
  }
})

// POST route for adding a new coffee, transaction
coffeesRouter.post(
  '/add',
  rejectUnauthenticated,
  async (req: TypedRequest<CoffeeItem>, res) => {
    const connection = await pool.connect()

    try {
      await connection.query('BEGIN;')

      // Query #1
      // Create new coffee entry in "coffees", return ID for flavors
      const newCoffeeSqlText = `
        INSERT INTO "coffees" (
          "roaster", 
          "roast_date", 
          "is_blend", 
          "blend_name", 
          "country", 
          "producer", 
          "region", 
          "elevation", 
          "cultivars", 
          "processing", 
          "notes", 
          "coffee_pic"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING "id";
      `

      const result = await connection.query(newCoffeeSqlText, [
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
      ])

      // Query #2
      // Add entry to "users_coffees" to pair coffee with current user
      const newCoffeeId: number = result.rows[0].id // New ID is here

      const usersCoffeesSqlText = `
        INSERT INTO "users_coffees" ("coffees_id", "users_id", "brewing")
        VALUES ($1, $2, $3);
      `

      await connection.query(usersCoffeesSqlText, [
        newCoffeeId,
        req.user?.id,
        req.body.brewing,
      ])

      // Query #3
      // Adding new flavors to coffees_flavors
      // Build SQL query for each new entry in flavors_array
      const sqlValues = req.body.flavorsArray
        .map((_, i) => `($1, $${i + 2})`)
        .join(', ')

      const newFlavorsSqlText = `
        INSERT INTO "coffees_flavors" ("coffees_id", "flavors_id")
        VALUES ${sqlValues};
      `

      await connection.query(newFlavorsSqlText, [newCoffeeId, ...req.body.flavorsArray])

      // Complete transaction
      await connection.query('COMMIT;')
      res.sendStatus(201) // Send back success!
    } catch (err) {
      await connection.query('ROLLBACK;')
      console.log('Error in add coffee POST in coffeesRouter, rollback: ', err)
      res.sendStatus(500)
    } finally {
      connection.release()
    }
  }
)

// DELETE route for a coffee from their dashboard
coffeesRouter.delete('/delete/:id', rejectUnauthenticated, async (req, res) => {
  const connection = await pool.connect()

  try {
    await connection.query('BEGIN;')

    // Query #1
    // Delete entry from users_coffees to delete coffee from user's dashboard
    const deleteUsersCoffeesEntrySqlText = `
        DELETE FROM "users_coffees" 
        WHERE "users_id" = $1 AND "coffees_id" = $2;
      `
    await connection.query(deleteUsersCoffeesEntrySqlText, [
      req.user?.id,
      req.params.id,
    ])

    // Query #2
    // Check to see if this coffee is shared. If not, delete it from db
    const deleteCoffeeSqlText = `
        DELETE FROM "coffees"  
        WHERE NOT EXISTS (
            SELECT * FROM "shared_coffees" WHERE "coffees_id" = $1
          ) 
          AND "coffees".id = $1;
      `
    await connection.query(deleteCoffeeSqlText, [req.params.id])

    // Complete transaction
    await connection.query('COMMIT;')
    res.sendStatus(204) // Send back success
  } catch (err) {
    await connection.query('ROLLBACK;')
    console.log('Error in delete coffee DELETE in coffeesRouter, rollback: ', err)
    res.sendStatus(500)
  } finally {
    connection.release()
  }
})

export { coffeesRouter }
