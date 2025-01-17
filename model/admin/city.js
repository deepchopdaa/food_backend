const mongoose = require('mongoose')
const citySchema = new mongoose.Schema({
    state_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'state'
    },
    ciy_name: {
        type: String,
        require: true
    },
    pincode: {
        type: Number,
        require: true
    }
}, { timestamps: true })

const city = mongoose.model('city', citySchema);
module.exports = city