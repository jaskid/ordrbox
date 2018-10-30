require('dotenv').load();
const jwt = require('jsonwebtoken');
const db = require('../models');

// make sure user is logged in
exports.loginRequired = function(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if(err) { return next(err); }
            if(decoded) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: 'You have to be logged in to do that!'
                });
            }
        });
    } catch(err) {
        return next({
            status: 401,
            message: 'You have to be logged in to do that!'
        });
    }
};

// make sure we get the correct user
exports.ensureCorrectUser = function(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if(err) { return next(err); }
            if(decoded && decoded.id === req.params.userid) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: 'You are not authorized to do that.'
                });
            }
        });
    } catch(err) {
        return next({
            status: 401,
            message: 'You are not authorized to do that.'
        });
    }
};

// TODO: better system than checking for adminship, then membership
// check to make sure a user is authorized to join a group
exports.ensureGroupMembership = function(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded){
            try {
                if(err) { return next(err); }
                if(decoded) {
                    let group = await db.Group.findById(req.params.groupid);
                    // first check to see if they're an admin:
                    let admin = group.admins.some(a => {
                        return a.equals(decoded.id);
                    });
                    if(admin) {
                        res.locals.admin = true;
                        return next();
                    } else {
                        // if not, check to see if they're a member:
                        let member = group.members.some(m => {
                            res.locals.admin = false;
                            return m.equals(decoded.id);
                        });
                        
                        if(member) {
                            return next();
                        } else {
                            return next({
                                status: 401,
                                message: 'You are not authorized to do that. (mem not found)'
                            });
                        }
                    }
                }
            } catch(e) {
                console.log(e.message);
                return next({
                    status: 401,
                    message: 'You are not authorized to do that. (token error async)'
                });
            }
        });
    } catch(err) {
        console.log(err);
        return next({
            status: 401,
            message: 'You are not authorized to do that. (tok err?)'
        });
    }
};

// check to see if a user owns a group
exports.ensureGroupOwnership = function(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded){
            if(err) { return next(err); }
            if(decoded) {
                const group = await db.Group.findById(req.params.groupid);
                let admin = group.admins.some(a => {
                    return a.equals(decoded.id);
                });
                if(admin) {
                    res.locals.admin = true;
                    return next();
                } else {
                    return next({
                        status: 401,
                        message: 'You are not authorized to do that.'
                    });
                }
            }
        });
    } catch(err) {
        console.log(err);
        return next({
            status: 401,
            message: 'You are not authorized to do that.'
        });
    }
};

exports.ensureOrderOwnership = function(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async function(err, decoded){
            if(err) { return next(err); }
            if(decoded) {
                const group = await db.Group.findById(req.params.groupid);
                let admin = group.admins.some(a => {
                    return a.equals(decoded.id);
                });
                if(admin) {
                    res.locals.admin = true;
                    return next();
                } else {
                    return next({
                        status: 401,
                        message: 'You are not authorized to do that.'
                    });
                }
            }
        });
    } catch(err) {
        console.log(err);
        return next({
            status: 401,
            message: 'You are not authorized to do that.'
        });
    }
};