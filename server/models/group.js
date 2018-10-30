const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Project = require('./project');
const User = require('./user');
const Order = require('./order');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a display name.'],
        unique: true
    },
    handle: {
        type: String,
        required: [true, 'Please enter a unique handle for your group.'],
        unique: [true, 'Sorry, that handle is already taken!']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.']
    },
    description: {
        type: String,
        maxLength: [100, 'Your description is too long (100 chars max).']
    },
    privacy: {
        type: Boolean,
        default: false
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    birthday: {
        type: Date,
        default: Date.now
    }
});

// AUTOPOPULATE (for Sidebar Requests)
var autoPopulateProjects = function(next) {
    this.populate('projects', {name: true});
    next();
};
groupSchema
    .pre('findById', autoPopulateProjects)
    .pre('findOne', autoPopulateProjects)
    .pre('find', autoPopulateProjects);

// HASH PASSWORD
groupSchema.pre('save', async function(next) {
    try {
        if(!this.isModified('password')) {
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        
        return next();
    } catch(err) {
        return next(err);
    }
});

// KICK USER
groupSchema.methods.kickUser = async function(user, next) {
    try {
        // remove group from user's list of groups
        await user.kickFromGroup(this.id);
        this.members.remove(user.id);
        this.save();
        
        return next();
    } catch(err) {
        return next(err);
    }
};

// PROMOTE USER
groupSchema.methods.promoteUser = async function(user, next) {
    try {
        this.admins.push(User.findById(user.id));
        this.members.remove(user.id);
        this.save();
        
        return next();
    } catch(err) {
        return next(err);
    }
};

// DEMOTE USER
groupSchema.methods.demoteUser = async function(user, next) {
    try {
        this.members.push(User.findById(user.id));
        this.admins.remove(user.id);
        this.save();
        
        return next();
    } catch(err) {
        return next(err);
    }
};

// AUTHENTICATE
groupSchema.methods.comparePassword = async function(candidatePw, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePw, this.password);
        return isMatch;
    } catch(err) {
        return next(err);
    }
};

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;