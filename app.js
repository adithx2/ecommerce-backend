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

const frontend_url = process.env.FRONTEND_URL;
const allowedOrigins = frontend_url
    ? frontend_url.split(',').map(url => url.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use('/users', userRoutes)

app.use('/products', productRoutes)


app.get('/', (req, res) => {

    res.sen('Hello World')
})

const port = process.env.PORT || 5000

app.listen(port, () => {

    console.log('Server started successfully')

})
