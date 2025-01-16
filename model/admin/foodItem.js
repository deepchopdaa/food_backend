const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant'
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    item_name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        requrie: true
    },
    image_url: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    quantity: {
        type: String,
        enum: ['kg', 'pic', 'liter', 'box']
    }
}, { timestamps: true })

const food = mongoose.model('food', foodSchema);
module.exports = food