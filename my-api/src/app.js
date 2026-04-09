const express = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware: cho phép đọc JSON từ body của request
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({message: 'API is running'});
})

app.use('/users', userRoutes);

// Middleware: xử lý lỗi - phải đặt Cuối cùng
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;