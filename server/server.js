const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route imports
const userRouter = require('./routes/user.router');
const methodsRouter = require('./routes/methods.router');
const coffeesRouter = require('./routes/coffees.router');
const oneCoffeeRouter = require('./routes/oneCoffee.router');
const flavorsRouter = require('./routes/flavors.router');
const brewsRouter = require('./routes/brews.router');
const s3Router = require('react-dropzone-s3-uploader/s3router');

// S3 Uploader
app.use(
  '/s3',
  s3Router({
    bucket: process.env.AWS_S3_BUCKET, // required
    region: process.env.AWS_S3_REGION, // optional
    headers: { 'Access-Control-Allow-Origin': '*' }, // optional
    ACL: 'public-read', // this is the default
  })
);

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
app.use('/api/oneCoffee', oneCoffeeRouter);

// Serve static files
app.use(express.static('build'));
// App set
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
