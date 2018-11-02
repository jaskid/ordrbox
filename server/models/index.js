require('dotenv').load();
const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

// CONNECT
const url = process.env.MONGO_URL;
mongoose.connect(url, {
    keepAlive: true,
    useNewUrlParser: true
});

// MODULES
module.exports.User = require('./user');
module.exports.Project = require('./project');
module.exports.Group = require('./group');
module.exports.Order = require('./order');