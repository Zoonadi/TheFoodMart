const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imgName: { type: String, required: true }
})

module.exports = mongoose.model('Item', itemSchema)