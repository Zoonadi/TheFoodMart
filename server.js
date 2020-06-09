if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey, stripePublicKey)

const indexRouter = require('./routes/index')
const productRouter = require('./routes/items')

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

const passport = require('passport')
const flash = require ('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email =>  users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

//This is for the login module
const bcrypt = require('bcrypt')
const users = []

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.json())
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/products', productRouter)

app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.json())


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

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, 
            password:hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

app.get('/login', (req, res) => {
    
    res.render('login.ejs', {name: 'User'})
})

/*
hash(salt + 'password') // dddddd
hash(salt2 + 'password') // eeeee
*/

//This is where you need to direct the login page to the user page
app.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/register', (req, res) => {
    res.render('register.ejs')
    
})

app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
        id: Date.now().toString(),
        name:req.body.name,
        email: req.body.email,
        password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

/*
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
*/

app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
        if (error) {
            res.status(500).end()
        } else {
           const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.medical_supplies.concat(itemsJson.meat, itemsJson.vegetables, itemsJson.fruits)
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

