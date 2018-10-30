const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../models');

// MIDDLEWARE
const { ensureGroupOwnership, ensureOrderOwnership } = require('../middleware/auth');

/*  /api/hub/group/:groupid/order  */

// CREATE ORDER
router
    .route('/')
    .post(async function(req, res, next) {
        try {
            console.log(req.body);
            if(req.body.group !== req.params.groupid) { throw {message: 'Group ID mismatch error.'}; }
            if(req.body.items.length === 0) { throw {message: 'You must have at least one item!'}; }
            
            const order = await db.Order.create(req.body);
            // save this to the group, the project, and the user for easy retrieval
            let foundGroup = await db.Group.findById(req.body.group);
            foundGroup.orders.push(order.id);
            await foundGroup.save();
            if(req.body.project) {
                try {
                    let foundProject = await db.Project.findById(req.body.project);
                    foundProject.orders.push(order.id);
                    await foundProject.save();
                } catch(err) {
                    return next(err);
                }
            }
            let foundUser = await db.User.findById(req.body.user);
            foundUser.orders.push(order.id);
            await foundUser.save();
            
            let { id } = order;
            return res.status(200).json({id});
        } catch(err) {
            console.log(err.message);
            return next(err);
        }
    });

// GET ORDER, STAMP/CANCEL ORDER (ADMIN), DELETE (SUBMITTER, ONCE CANCELED)
router
    .route('/:orderid')
    .get(async function(req, res, next) {
        // return full order info
        try {
            let order = await db.Order.findById(req.params.orderid)
                                .populate('user', {name: true})
                                .populate('group', {name: true})
                                .populate('project', {name: true});
            return res.status(200).json(order);
        } catch(err) {
            return next(err);
        }
    })
    .post(ensureGroupOwnership, async function(req, res, next) {
        // STAMP ORDER, CANCEL ORDER - FOR ADMINS ONLY
        try {
            if(req.params.orderid !== req.body.orderid) {
                throw {message: "Order ID mismatch error."};
            }
            if(req.body.stampid) {
                const order = await db.Order.findByIdAndUpdate(req.body.orderid, {
                    stamped: true,
                    stampid: req.body.stampid
                }, {new: true});
                return res.status(200).json(order);
            } else if(req.body.canceled) {
                const order = await db.Order.findByIdAndUpdate(req.body.orderid, {
                    canceled: true
                }, {new: true});
                return res.status(200).json(order);
            } else {
                return res.status(500).json({
                    message: 'Oops, something went wrong!'
                });
            }
        } catch(err) {
            return next(err);
        }
    })
    .delete(ensureOrderOwnership, async function(req, res, next) {
        // delete IF order is already canceled
        try {
            if(req.params.orderid !== req.body.orderid) {
                throw {message: "Order ID mismatch error."};
            }
            const order = await db.Order.findById(req.body.orderid);
            if(order.canceled) {
                // TODO: ensure that the pre remove is running fine
                await order.remove();
                return res.status(200);
            } else {
                return res.status(500).json({
                    message: 'Order must be canceled in order to delete.'
                });
            }
            
        } catch(err) {
            return next(err);
        }
    });

// PUT ORDER ON HOLD - FOR ADMINS/SUBMITTER
router
    .route('/:orderid/hold')
    .post(ensureOrderOwnership, async function(req, res, next) {
        try {
            if(req.params.orderid !== req.body.orderid) {
                throw {message: "Order ID mismatch error."};
            }
            console.log(req.body.hold.hold);
            const order = await db.Order.findByIdAndUpdate(req.body.orderid, {
                hold: req.body.hold
            }, {new: true});
            
            return res.status(200).json(order);
        } catch(err) {
            return next(err);
        }
    });

module.exports = router;