const mongoose = require('mongoose')
const validator = require('validator')

const urlShortnerSchema = new mongoose.Schema({
    toUrl: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isURL(value, { require_host: false })) {
                throw new Error('To URL is not valid')
            }
        }
    },
    fromUrl: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
})

const shortUrl = mongoose.model('shortUrl', urlShortnerSchema)

module.exports = shortUrl