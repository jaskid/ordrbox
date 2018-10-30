const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../models');
const projectRoutes = require('./projects');
const orderRoutes = require('./orders');
const mongoose = require('mongoose');

// MIDDLEWARE
const { ensureGroupMembership, ensureGroupOwnership } = require('../middleware/auth');
router.use('/:groupid/project', ensureGroupMembership, projectRoutes);
router.use('/:groupid/order', ensureGroupMembership, orderRoutes);

/*  /api/hub/group  */

// CREATE NEW GROUP
router
    .route('/')
    .post(async function(req, res, next) {
        try {
            let { password, confirm_password, name, handle } = req.body;
            
            // validate lengths
            if(name.length < 1) { throw {message:'Please enter a group displayname.'}; }
            if(handle.length > 16) { throw {message:'You group displayname cannot be longer than 16 characters.'}; }
            if(handle.length < 1) { throw {message:'Please enter a unique group handle.'}; }
            if(handle.length > 16) { throw {message:'You group handle cannot be longer than 16 characters.'}; }
            
            // validate for special chars
            if(handle.includes(' ')) { throw {message:'You group handle cannot include any spaces.'}; }
            if(/[~`!#$@%\^&*+=[\]\\';,/{}()|\\":<>\?]/g.test(handle)) { throw {message:'Your handle cannot include any special characters.'}; }
            
            // validate password match
            if((typeof confirm_password != 'undefined') && (password !== confirm_password)) {
                throw {message:"Passwords don't match."};
            }
            
            // validate password chars
            if (password.length < 6) {
              throw {message:'Your password must be at least 6 characters long.'};
            } else if (password.search(/[a-z]/) < 0) {
              throw {message:'Your password must include a lower case letter.'};
            } else if(password.search(/[A-Z]/) < 0) {
              throw {message:'Your password must include an upper case letter.'};
            } else  if (password.search(/[0-9]/) < 0) {
              throw {message:'Your password must include a number.'};
            }
            // capitalize displayname
            name = name.charAt(0).toUpperCase() + name.slice(1);
            let group = await db.Group.create({
                name: name,
                handle: handle,
                admins: [req.body.userid],
                privacy: req.body.privacy,
                description: req.body.description,
                password: password
            });
            
            // add group to user's list
            let foundUser = await db.User.findById(req.body.userid);
            foundUser.groups.push(group.id);
            await foundUser.save();
            
            let { id } = group;
            return res.status(200).json({
                id
            });
        } catch(err) {
            if(err.code === 11000) {
                err.message = "Sorry, that group name is already taken!";   
            }
            return next({
                status: 400,
                message: err.message
            });
        }
    });

// GET/EDIT/DELETE GROUP INFO
router
    .route('/:groupid')
    .get(ensureGroupMembership, async function(req, res, next) {
        // return group info (not orders or projects)
        try {
            let group = await db.Group.findById(req.params.groupid);
            let returnGroup = {
                name: group.name,
                handle: group.handle,
                description: group.description,
                projects: group.projects,
                numMembers: (group.members.length + group.admins.length),
                numOrders: group.orders.length,
                // from ensureGroupMembership middleware:
                admin: res.locals.admin
            };
            
            return res.status(200).json(returnGroup);
        } catch(err) {
            return next(err);
        }
    })
    .post(ensureGroupOwnership, async function(req, res, next) {
        try {
            console.log(req.body);
            let { name, description } = req.body;
            name = name.charAt(0).toUpperCase() + name.slice(1);
            const group = await db.Group.findByIdAndUpdate(req.params.groupid, {
                name: name,
                description: description
            });
            
            return res.status(200).json({id: group.id});
        } catch(err) {
            return next(err);
        }
        // TODO
        // edit group based on req.body
        // (EDIT includes ACTIONS such as KICK, PROMOTE, DEMOTE, and EDIT)
    })
    .delete(ensureGroupOwnership, async function(req, res, next) {
        try {
            console.log('::DELETING GROUP::');
            const group = await db.Group.findById(req.params.groupid);
            console.log(group);
            // delete members
            for(let i = 0; i < group.members.length; i++) {
                console.log(`kicking member: ${group.members}`);
                let user = await db.User.findById(group.members[i]._id);
                await user.kickFromGroup(group.id);
            }
            // iterate down through orders (as they will remove themselves from the group)
            for(let j = group.orders.length - 1; j >= 0; j--) {
                console.log(`deleting order: ${group.orders[j]._id}`);
                await db.Order.findById(group.orders[j]._id).remove();
            }
            // delete projects
            for(let t = group.projects.length - 1; t >= 0; t--) {
                console.log(`deleting project: ${group.projects[t]._id}`);
                await db.Project.findById(group.projects[t]._id).remove();
            }
            // finally, the admins go
            for(let f = 0; f < group.admins.length; f++) {
                console.log(`kicking admin: ${group.admins[f]}`);
                let admin = await db.User.findById(group.admins[f]._id);
                await admin.kickFromGroup(group.id);
            }
            await group.remove();
            return res.status(200).json({
                message: 'Group successfully deleted.'
            });
        } catch(err) {
            return next(err);
        }
    });

// ORDER QUERY
router
    .route('/:groupid/orders')
    .post(ensureGroupMembership, async function(req, res, next) {
        // return group's orders based on req.body.query
        try {
            var result;
            const groupid = req.params.groupid;
            const query = req.body;
            if(query.key && query.value.length > 0) {
                switch(query.key) {
                    case 'user':
                        const users = await db.User.find({"name": new RegExp('.*'+query.value+'.*', "i") }).populate({
                            "path": "orders",
                            "match": { "group": mongoose.Types.ObjectId(groupid), "stamped": query.stamped, "canceled": false },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        result = [];
                        users.forEach(u => {
                            result.push(...u.orders);
                        });
                        break;
                    case 'vendor':
                        result = await db.Group.findById(groupid).populate({
                            "path": "orders",
                            "match": { "metadata.vendor" : new RegExp('.*'+query.value+'.*', "i"), "stamped": query.stamped, "canceled": false },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        result = result.orders;
                        break;
                    case 'quoteNum':
                        result = await db.Group.findById(groupid).populate({
                            "path": "orders",
                            "match": { "metadata.quoteNum" : new RegExp('^'+query.value+'.*', "i"), "stamped": query.stamped, "canceled": false },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        result = result.orders;
                        break;
                }
            } else {
                result = await db.Group.findById(groupid).populate({
                    "path": "orders",
                    "match": { "stamped": query.stamped, "canceled": false },
                    "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                });
                result = result.orders;
            }
            
            return res.status(200).json(result);
        } catch(err) {
            return next(err);
        }
    });

module.exports = router;