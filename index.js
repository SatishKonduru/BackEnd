const express = require('express')
const cors = require('cors')
const connection  = require('./connection')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const categoryRoute = require('./routes/category')
const billRoute = require('./routes/bill')
const dashboardRoute = require('./routes/dashboard')


const app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/user',userRoute)
app.use('/product', productRoute)
app.use('/category', categoryRoute)
app.use('/bill', billRoute)
app.use('/dashboard', dashboardRoute)

module.exports = app