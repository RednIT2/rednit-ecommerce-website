require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shoeRoutes = require('./routes/shoeRoute');
const userRoutes = require('./routes/userRoute');

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware

const allowedOrigins = [
    "http://localhost:3000",
    "https://rednit-ecommerce-website-ngo-thanh-dats-projects.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Bổ sung header thủ công để xử lý preflight OPTIONS
app.options('*', cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/shoes', shoeRoutes);
app.use('/users', userRoutes); 

// Serve file ảnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
