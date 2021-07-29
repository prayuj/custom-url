const mongoose = require('mongoose')

const userAccessInfoModel = new mongoose.Schema({
    additional: {
        type: String
    },
    url: {
        type: String
    },
    target: {
        type: String
    }
}, {
    timestamps: true
});

const userAccessInfo = mongoose.model('userAccessInfo', userAccessInfoModel)
module.exports = userAccessInfo