const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cors = require('cors')

const userRoutes = require('./routers/userRoutes')
const productRoutes = require('./routers/productRoutes')
connectDB()

const app = express()

app.use(cookieParser())

app.use(express.json())

const frontend_url = process.env.FRONTEND_URL

app.use(cors({

    origin: frontend_url,
    credentials: true,
}))

app.use('/users', userRoutes)

app.use('/products', productRoutes)


app.get('/', (req, res) => {

    console.log("Hello World")

})

port = process.env.PORT || 5000

app.listen(port, () => {

    console.log('Server started successfully')

})