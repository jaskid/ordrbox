const mongoose = require('mongoose');
const User = require('./user');
const Project = require('./project');
const Group = require('./group');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    metadata: {
        vendor: {type: String, required: [true, 'Please enter a vendor name.']},
        quantity: {type: Number, default: 1},
        contacts: [{name: String, email: String}],
        quoteNum: {type: String, maxLength: [50, 'Your quote number must be less than 50 characters.']},
        shipping: {type: String, required: true},
        note: String,
        extendedCost: {type: Number, required: true}
    },
    items: [
        {
            description: {type: String, maxLength: [40, 'Your item descriptions must be less than 40 characters.']},
            itemNum: {type: String, required: true, maxLength: [40, 'Your Item/PT numbers must be less than 40 characters.']},
            quantity: {type: Number, required: [true, 'Please enter a quantity for your items.']},
            unitCost: {type: Number, required: [true, 'Please enter a unit cost for all your items.']},
            delivery: {type: Date, required: [true, 'Please enter a delivery data for all your items.']}
        }
    ],
    stamped: {
        type: Boolean,
        default: false
    },
    hold: {
        type: Boolean,
        default: false
    },
    canceled: {
        type: Boolean,
        default: false
    },
    stampid: String,
    submitTimestamp: {
        type: Date,
        default: Date.now
    },
    stampTimestamp: Date
});

// AUTOPOPULATE FOR SUBJECT RETRIEVAL
const autoPopulate = function(next) {
    this.populate('project', 'name');
    this.populate('user', 'name');
    next();
};
orderSchema
    .pre('findOne', autoPopulate)
    .pre('find', autoPopulate);

// DELETE ORDER
orderSchema.pre('remove', async function(next) {
    try {
        // find group
        let group = await Group.findById(this.group.id);
        // remove id of order from the group's order list
        group.orders.remove(this.id);
        // save that group
        await group.save();
        
        // doing the same for project
        let project = await Project.findById(this.project.id);
        project.orders.remove(this.id);
        await project.save();
        
        // and the same for user
        let user = await User.findById(this.user.id);
        user.orders.remove(this.id);
        await user.save();
        
        return next();
    } catch(err) {
        return next(err);
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;