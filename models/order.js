/*
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart:{type: Object, required:true}, //This might not be necessary 
    address:{type: String, required: true},
    name: {type:String, required:true},
    paymentId: {type: String, required: true}
});

//This is episode 17 
 module.exports = mongoose.model('Order', itemSchema); */