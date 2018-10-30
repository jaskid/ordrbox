// SETUP/DEPENDENCIES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
// const jwt = require('jsonwebtoken');

// ROUTES
const authRoutes = require('./routes/auth');
const hubRoutes = require('./routes/hub');

// PORT
const PORT = process.env.PORT || 8081;

const app = express();
    // , server = require('http').createServer(app),
    // io = require('socket.io').listen(server);

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
const { loginRequired } = require('./middleware/auth');

// for testing, pls ignore
// const alertMe = function(req, res, next) {
//     console.log('routes pinged');
//     return next();
// };

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/hub', loginRequired, hubRoutes);

// ERROR HANDLING (covered by errorHandler?)
// app.use(function(req,res,next) {
//     let err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.use(errorHandler);

// LISTEN
app.listen(PORT, function(){
    console.log(`Server is running on port ${PORT}`);
});

// --------- SOCKET.IO CONFIG ---------
// var clients = {};
// io.use(function(socket, next){
//     if (socket.handshake.query && socket.handshake.query.token){
//         jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, function(err, decoded) {
//             if(err) return next(new Error('Authentication error.'));
//             socket.decoded = decoded;
//             clients[decoded.id] = socket.id;
//             next();
//         });
//     } else {
//         next(new Error('Authentication error.'));
//     }    
// })
// .on('connection', function(socket) {
//     console.log('User connected.');
    
//     // var index = clients.length - 1;
    
//     socket.emit('change color', 'red');

//     socket.on('message', function(message) {
//         io.emit('message', message);
//     });
//     socket.on('disconnect', function(index) {
//         console.log('User disconnected');
//         // clients.splice(index, 1);
//     });
// });
// server.listen(PORT, function() {
//     console.log(`Server is running on port ${PORT}`);
// })