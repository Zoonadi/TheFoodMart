
const express = require('express')
const { default: Stripe } = require('stripe')
const router = express.Router()
//const Order = require('../models/order')

router.get('/', (req, res) => {
    res.render('index')
})
/*
router.get('/add-to-cart/:id', function(req, res, next){
    var cart = new cart(req.session.cart ? req.session.cart : {items: {}});
})
router.post('/orders', function(req, res, next){
    const order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
    })
    order.save(function (err, result) {
        req.flash('success', 'Successfully bought product!')
        res.redirect('/')
    }); // Saving the order to the database


})
*/


module.exports = router; 