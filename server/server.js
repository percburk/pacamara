const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route imports
const userRouter = require('./routes/user.router');

// Middleware ---------------------------------- //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport session configuration
app.use(sessionMiddleware);
// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes --------------------- //
app.use('/api/user', userRouter);

// Serve static files
app.use(express.static('build'));
// App set
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
