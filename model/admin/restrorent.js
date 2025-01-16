const mongoose = require("mongoose");
const restrorentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    area: {
        type: String,
        require: true
    },
    /* city_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city'
    } */
}, { timestamps: true })
const restaurants = mongoose.model('restaurant', restrorentSchema)
module.exports = restaurants