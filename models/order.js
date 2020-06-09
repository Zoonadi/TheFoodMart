const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart:{type: Object, required:true},
    address:{type: String, required: true},
    name: {type:String, required:true},
})
//This is episode 17
module.exports = mongoose.model('Order', itemSchema)