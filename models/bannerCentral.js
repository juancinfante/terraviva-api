const { Schema, model } = require('mongoose');

const bannerCentralModel = Schema({
    bannerFull: {
        type: String,
        required: true
    },
    bannerMobile: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})


module.exports = model('bannerCentral', bannerCentralModel);