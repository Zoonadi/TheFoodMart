const express = require('express')
const router = express.Router()
const Item = require('../models/item')

// All Items Route 
router.get('/', (req, res) => {
    res.render('items/index')
})

// New Items Route
router.get('/new', (req, res) => {
    res.render('items/new', {product: new Item()})
})

//Create Items Route
router.post('/', (req, res) => {
    res.send('Create')
})

module.exports = router 