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
    country_name: {
        type:String,
        require:true
    },
    state_name: {
        type:String,
        require:true
    },
    city_name: {
        type:String,
        require:true
    }
}, { timestamps: true })
const restaurants = mongoose.model('restaurant', restrorentSchema)
module.exports = restaurants