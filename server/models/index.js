require('dotenv').load();
const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

// CONNECT
// let pw = encodeURIComponent(process.env.MONGO_PW);
// const url = `mongodb://req-submit:${pw}@ds119323.mlab.com:19323/requestio-testio`
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