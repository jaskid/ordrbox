const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter a valid email address.'],
        unique: true
    },
    confirmed: {type: Boolean, default: true},
    name: {
        type: String,
        required: [true, 'Please enter a name.'],
        minlength: [3, 'Surely your name must be at least 3 characters long!']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Your password must be 6 characters long.']
    },
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    alerts: [String]
});

// HASH PASSWORD
userSchema.pre('save', async function(next) {
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

// AUTHENTICATION
userSchema.methods.comparePassword = async function(candidatePw, next) {
    try {
        let isMatch = await bcrypt.compare(candidatePw, this.password);
        return isMatch;
    } catch(err) {
        return next(err);
    }
};

// REMOVE GROUP
userSchema.methods.kickFromGroup = async function(groupid, next) {
    try {
        await this.update({ $pull: { groups: groupid } });
        this.save();
    } catch(err) {
        return next(err);
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;