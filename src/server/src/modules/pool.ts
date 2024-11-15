import url from 'url'
import pg from 'pg'

const getConfig = () => {
  // Heroku gives a url, not a connection object
  // https://github.com/brianc/node-pg-pool
  if (process.env.DATABASE_URL) {
    const { hostname, port, pathname, auth } = url.parse(process.env.DATABASE_URL)
    const authArray = auth?.split(':')

    if (authArray) {
      return {
        user: authArray[0],
        password: authArray[1],
        host: hostname ?? undefined,
        port: Number(port) ?? undefined,
        database: pathname?.split('/')[1],
        ssl: { rejectUnauthorized: false },
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
      }
    }
  }

  return {
    host: 'localhost', // Server hosting the postgres database
    port: 5432, // env var: PGPORT
    database: 'pacamara', // Adjusted database name for this particular app
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  }
}

// this creates the pool that will be shared by all other modules
export const pool = new pg.Pool(getConfig())

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err)
  process.exit(-1)
})
