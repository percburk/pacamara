import express from 'express';
const app = express();
import bodyParser from 'body-parser';
require('dotenv').config();
import sessionMiddleware from './modules/session.middleware';
import passport from './strategies/user.strategy';

// Route imports
import userRouter from './routes/user.router';
import methodsRouter from './routes/methods.router';
import coffeesRouter from './routes/coffees.router';
import oneCoffeeRouter from './routes/oneCoffee.router';
import flavorsRouter from './routes/flavors.router';
import brewsRouter from './routes/brews.router';
import shareRouter from './routes/share.router';
import s3Router from './routes/s3.router';

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
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
