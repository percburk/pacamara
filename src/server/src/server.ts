import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import sessionMiddleware from './modules/sessionMiddleware'
// Route imports
import brewsRouter from './routes/brewsRouter'
import coffeesRouter from './routes/coffeesRouter'
import flavorsRouter from './routes/flavorsRouter'
import methodsRouter from './routes/methodsRouter'
import oneCoffeeRouter from './routes/oneCoffeeRouter'
import s3Router from './routes/s3Router'
import shareRouter from './routes/shareRouter'
import userRouter from './routes/userRouter'
import passport from './strategies/userStrategy'
// App instance
const app = express()

// --- Middleware --- //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.CLIENT_BASE_URL, credentials: true }))
// Passport session configuration
app.use(sessionMiddleware)
// Start up passport sessions
app.use(passport.initialize())
app.use(passport.session())

// --- Routes --- //
app.use('/api/user', userRouter)
app.use('/api/methods', methodsRouter)
app.use('/api/coffees', coffeesRouter)
app.use('/api/flavors', flavorsRouter)
app.use('/api/brews', brewsRouter)
app.use('/api/one-coffee', oneCoffeeRouter)
app.use('/api/share', shareRouter)
app.use('/s3', s3Router)

// Serve static files
app.use(express.static('build'))
// App set
const PORT: string | 5000 = process.env.PORT || 5000
// Start server
app.listen(PORT, () => console.log('Listening on port:', PORT))
