const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../models');

/*  /api/hub/user/:userid  */

// NOTE: These are all private routes, only accessable by user.

// GET USER INFO
router
    .route('/')
    .get(async function(req, res, next) {
        // return user info (not orders or groups)
        try {
            let user = await db.User.findById(req.params.userid)
                        .populate('orders');
            let returnUser = {
                name: user.name,
                orders: user.orders,
                email: user.email,
                alerts: user.alerts
            };
            
            return res.status(200).json(returnUser);
        } catch(err) {
            return next(err);
        }
    });

// NAV: USER GROUPS
router
    .route('/groups')
    .get(async function(req, res, next) {
        try {
            // maybe just get user.groups?
            let user = await db.User.findById(req.params.userid)
                .populate('groups', { name: true, id: true, projects: true, admins: true });
            
            let returnGroups = user.groups.map(g => {
                let _g = { name: g.name, id: g.id, projects: g.projects };
                if( g.admins.some(a => a.equals(req.params.userid)) ) {
                    _g.admin = true;
                }
                return _g;
            });
            // console.log('return groups:');
            // console.log(returnGroups);
            
            return res.status(200).json(returnGroups);
        } catch(err) {
            return next(err);
        }
    });

// ORDER QUERY
router
    .route('/orders')
    .post(async function(req, res, next) {
        // return user's orders based on req.body.query
        // TODO: add query for canceled orders only
        try {
            var user;
            const userid = req.params.userid;
            const query = req.body;
            if(query.key && query.value.length > 0) {
                switch(query.key) {
                    case 'vendor':
                        user = await db.User.findById(userid).populate({
                            "path": "orders",
                            "match": { "metadata.vendor" : new RegExp('.*'+query.value+'.*', "i"), "stamped": query.stamped, "canceled": false  },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        break;
                    case 'quoteNum':
                        user = await db.User.findById(userid).populate({
                            "path": "orders",
                            "match": { "metadata.quoteNum" : new RegExp('^'+query.value+'.*', "i"), "stamped": query.stamped, "canceled": false  },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        break;
                }
            } else {
                if(typeof query.stamped != 'undefined') {
                    // canceled is included here bc in the future we may want to do both
                    user = await db.User.findById(userid).populate({
                        "path": "orders",
                        "match": { "stamped": query.stamped, "canceled": !!query.canceled },
                        "select": "user group project hold canceled metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                    });
                } else if(query.canceled) {
                    user = await db.User.findById(userid).populate({
                        "path": "orders",
                        "match": { "canceled": query.canceled },
                        "select": "user group project hold canceled metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                    });
                }
            }
            // console.log(user.orders);
            
            return res.status(200).json(user.orders);
        } catch(err) {
            return next(err);
        }
    });

module.exports = router;