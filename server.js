if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey, stripePublicKey)

const indexRouter = require('./routes/index')

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.json())
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)

app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
        if (error) {
            res.status(500).end()
    } else {
        res.render('store.ejs', {
            stripePublicKey: stripePublicKey,
            items: JSON.parse(data)
        })
    }
})
})

app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
        if (error) {
            res.status(500).end()
        } else {
           const itemsJson = JSON.parse(data)
           const itemsArray = itemsJson.music.concat(itemsJson.merch)
           let total = 0
           req.body.items.forEach(function(item) {
               const itemJson = itemsArray.find(function(i) {
                   return i.id == item.id 
               })
               total = total + itemJson.price * item.quantity
           })

           stripe.charges.create({
               amount:total,
               source: req.body.stripeTokenId,
               currency: 'zmw'
           }).then(function(){
               console.log('Charge Successful')
               res.json({ message: 'Successfully purchased items' })
           }).catch(function(){
               console.log('Charge Fail')
               res.json({ message: 'Unable to make a purchase' })
               res.status(500).end()
           })
        }
    })
})



app.listen(process.env.PORT || 3000) 

