const mongoose = require('mongoose')

const uniqueNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
})

const uniqueName = mongoose.model('uniqueName', uniqueNameSchema)

module.exports = uniqueName