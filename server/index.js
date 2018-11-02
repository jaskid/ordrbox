// SETUP/DEPENDENCIES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');

// ROUTES
const authRoutes = require('./routes/auth');
const hubRoutes = require('./routes/hub');

// PORT
const PORT = 8081;

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
const { loginRequired } = require('./middleware/auth');

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/hub', loginRequired, hubRoutes);

// ERROR HANDLING
app.use(function(req,res,next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(errorHandler);

// LISTEN
app.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`);
});