const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cors = require('cors')

const userRoutes = require('./routers/userRoutes')
const productRoutes = require('./routers/productRoutes')
connectDB()

const app = express()

const allowedOrigins = [

    "http://localhost:5173"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(cookieParser())

app.use(express.json())


app.use('/users', userRoutes)

app.use('/products', productRoutes)


app.get('/', (req, res) => {

    res.send('Hello World')
})

const port = process.env.PORT || 5000

app.listen(port, () => {

    console.log('Server started successfully')

})
