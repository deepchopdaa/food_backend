const mongoose = require('mongoose')
const stateSchema = new mongoose.Schema({
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'country'
    },
    state_name: {
        type: String,
        require: true
    }
}, { timestamps: true })

const state = mongoose.model('state', stateSchema);
module.exports = state