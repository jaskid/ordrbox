const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    expenses: Number,
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;