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

// Build allowed origins from env var + always allow localhost
const allowedOrigins = [
    "http://localhost:5173",
];

// Read FRONTEND_URL from env (supports comma-separated values)
if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',').forEach(url => {
        const cleaned = url.trim().replace(/\/+$/, ''); // remove trailing slashes
        if (cleaned && !allowedOrigins.includes(cleaned)) {
            allowedOrigins.push(cleaned);
        }
    });
}

console.log("Allowed CORS origins:", allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log("CORS blocked origin:", origin);
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true
}));
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

app.use('/users', userRoutes)

app.use('/products', productRoutes)


app.get('/', (req, res) => {

    res.send('Hello World')
})

const port = process.env.PORT || 5000

app.listen(port, () => {

    console.log('Server started successfully')

})
