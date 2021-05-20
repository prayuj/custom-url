const mongoose = require('mongoose')

const logModel = new mongoose.Schema({
    line: {
        type: String
    }
}, {
    timestamps: true
});

const log = mongoose.model('log', logModel)
module.exports = log