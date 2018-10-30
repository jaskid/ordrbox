const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../models');
const mongoose = require('mongoose');

/*  /api/hub/group/:groupid/project  */
const { ensureGroupOwnership } = require('../middleware/auth');

// CREATE NEW PROJECT
router
    .route('/')
    .post(ensureGroupOwnership, async function(req, res, next) {
        try {
            console.log('creatin new project');
            // check to make sure groupid hasnt been tampered with:
            if(req.body.groupid !== req.params.groupid) {
                // this makes sure the user doesnt submit to a group they are not
                // verified by middleware for
                console.log(`Group ID mismatch. look: ${req.body.groupid} and ${req.params.groupid}`);
                throw 'Group ID mismatch error.';
            }
            
            let project = await db.Project.create({
                name: req.body.name,
                group: req.params.groupid
            });
            // add project to group's project list
            let foundGroup = await db.Group.findById(req.params.groupid);
            foundGroup.projects.push(project.id);
            await foundGroup.save();
            
            let { id, name } = project;
            return res.status(200).json({
                id,
                name
            });
        } catch(err) {
            if(err.code === 11000) {
                // err.message = "11000 - report to sys admin.";
                err.message = "Sorry, that project name is already in use.";
            }
            return next({
                status: 400,
                message: err.message
            });
        }
    });

// GET/DELETE PROJECT INFO
router
    .route('/:projectid')
    .get(async function(req, res, next) {
        try {
            // do it this way so someone can't spoof a random project id off of
            // a groupid they are verified for.
            let project = await db.Project.findById(req.params.projectid)
                                            .populate('group', {
                                                    name: true,
                                                    id: true,
                                                    projects: true,
                                                    members: true,
                                                    admins: true
                                                });
            // check to make sure groupid hasnt been tampered with:
            let { group } = project;
            if(group.id !== req.params.groupid) {
                throw 'Group ID mismatch error.';
            }
            
            const admin = res.locals.admin;
            const numMembers = group.members.length + group.admins.length;
            const parentGroup = group.name;
            const projects = group.projects;
            const { id, name } = project;
            return res.status(200).json({
                id,
                name,
                parentGroup,
                numMembers,
                projects,
                admin
            });
        } catch(err) {
            console.log('project send error');
            console.log(err.message);
            if(err.code === 11000) {
                err.message = "11000 - report to sys admin.";           
            }
            return next({
                status: 400,
                message: err.message
            });
        }
    })
    .delete(ensureGroupOwnership, async function(req, res, next) {
        try {
            await db.Project.findById(req.params.projectid).remove();
            return res.status(200).json({
                message: 'Project successfully deleted.'
            });
        } catch(err) {
            return next(err);
        }
    });

// ORDER QUERY
router
    .route('/:projectid/orders')
    .post(async function(req, res, next) {
        // return project's orders based on req.body.query
        try {
            var result;
            const projectid = req.params.projectid;
            const query = req.body;
            if(query.key && query.value.length > 0) {
                switch(query.key) {
                    case 'user':
                        const users = await db.User.find({"name": new RegExp('.*'+query.value+'.*', "i") }).populate({
                            "path": "orders",
                            "match": { "project": mongoose.Types.ObjectId(projectid), "stamped": query.stamped, "canceled": false },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        result = [];
                        users.forEach(u => {
                            result.push(...u.orders);
                        });
                        break;
                    case 'vendor':
                        result = await db.Project.findById(projectid).populate({
                            "path": "orders",
                            "match": { "metadata.vendor" : new RegExp('.*'+query.value+'.*', "i"), "stamped": query.stamped, "canceled": false },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        result = result.orders;
                        break;
                    case 'quoteNum':
                        result = await db.Project.findById(projectid).populate({
                            "path": "orders",
                            "match": { "metadata.quoteNum" : new RegExp('^'+query.value+'.*', "i"), "stamped": query.stamped, "canceled": false },
                            "select": "user group project hold metadata.vendor metadata.quoteNum metadata.extendedCost submitTimestamp stampTimestamp"
                        });
                        result = result.orders;
                        break;
                }
            } else {
                result = await db.Project.findById(projectid).populate({
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