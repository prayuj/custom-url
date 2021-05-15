const mongoose = require('mongoose')

const availableNumberSchema = new mongoose.Schema({
    number: Number
})

const availableNumber = mongoose.model('availableNumber', availableNumberSchema)

module.exports = availableNumber