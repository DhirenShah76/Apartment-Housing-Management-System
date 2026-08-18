const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/units', require('./routes/unitRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
    res.send('Apartment360 API is active and operational.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server Running]: http://localhost:${PORT}`);
});