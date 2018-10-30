const express = require('express');
const router = express.Router({ mergeParams: true });
// const db = require('../models');
const groupRoutes = require('./groups');
const userRoutes = require('./users');

// MIDDLEWARE
const { ensureCorrectUser } = require('../middleware/auth');
router.use('/group', groupRoutes);
router.use('/user/:userid', ensureCorrectUser, userRoutes); 

/*  /api/hub  */

module.exports = router;

/* -----------[  HUB ROUTING GUIDE:  ]-----------
    NAV REQUESTS
    /user/:userid/groups : GET - userGroups
    
    SUBJECT INFO REQUESTS
    /group/:groupid : GET - group (info)
    /group/:groupid/project/:projectid : GET - project (info)
    /user/:userid : GET - user (info)
    
    ORDER SPECIFIC ROUTES
    /group/:groupid/order/:orderid : GET - view order
    /group/:groupid/order/:orderid : POST - stamp order
    
    SUBJECT ORDER QUERIES
    /group/:groupid/orders : POST - query orders
    /group/:groupid/project/:projectid/orders : POST - query orders
    /user/:userid/orders : POST - query orders
    
    CREATE POSTS
    /group : POST - create a new group
    /group/:groupid/order : POST - create a new order
    /group/:groupid/project : POST - create a new project
    
    EDIT POSTS
    /group/:groupid : POST - edit group
    /group/:groupid : DELETE - delete group
    /group/:groupid/project/:projectid : DELETE - delete project
*/