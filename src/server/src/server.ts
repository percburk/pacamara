import 'dotenv/config'
import express from 'express'
import { CLIENT_BUILD_PATH } from './constants/clientBuildPath'
import { sessionMiddleware } from './modules/sessionMiddleware'
import { brewsRouter } from './routes/brewsRouter'
import { coffeesRouter } from './routes/coffeesRouter'
import { flavorsRouter } from './routes/flavorsRouter'
import { methodsRouter } from './routes/methodsRouter'
import { oneCoffeeRouter } from './routes/oneCoffeeRouter'
import { s3Router } from './routes/s3Router'
import { shareRouter } from './routes/shareRouter'
import { userRouter } from './routes/userRouter'
import { passport } from './strategies/userStrategy'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Passport session configuration
app.use(sessionMiddleware)
// Start up passport sessions
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/user', userRouter)
app.use('/api/methods', methodsRouter)
app.use('/api/coffees', coffeesRouter)
app.use('/api/flavors', flavorsRouter)
app.use('/api/brews', brewsRouter)
app.use('/api/one-coffee', oneCoffeeRouter)
app.use('/api/share', shareRouter)
app.use('/s3', s3Router)

// Serve static files
app.use(express.static(CLIENT_BUILD_PATH))
// App set
const PORT: string | 5000 = process.env.PORT || 5000
// Start server
app.listen(PORT, () => console.log('Listening on port:', PORT))
