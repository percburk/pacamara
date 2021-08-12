import express, { Express } from 'express';
import bodyParser from 'body-parser';
import sessionMiddleware from './modules/sessionMiddleware';
import passport from './strategies/userStrategy';
// Route imports
import userRouter from './routes/userRouter';
import methodsRouter from './routes/methodsRouter';
import coffeesRouter from './routes/coffeesRouter';
import oneCoffeeRouter from './routes/oneCoffeeRouter';
import flavorsRouter from './routes/flavorsRouter';
import brewsRouter from './routes/brewsRouter';
import shareRouter from './routes/shareRouter';
import s3Router from './routes/s3Router';
// App instance
const app: Express = express();

// --- Middleware --- //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Passport session configuration
app.use(sessionMiddleware);
// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// --- Routes --- //
app.use('/api/user', userRouter);
app.use('/api/methods', methodsRouter);
app.use('/api/coffees', coffeesRouter);
app.use('/api/flavors', flavorsRouter);
app.use('/api/brews', brewsRouter);
app.use('/api/one-coffee', oneCoffeeRouter);
app.use('/api/share', shareRouter);
app.use('/s3', s3Router);

// Serve static files
app.use(express.static('build'));
// App set
const PORT: string | 5000 = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
