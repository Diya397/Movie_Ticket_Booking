require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const bookingRoutes = require('./routes/bookingRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3003;

connectDB();
connectRedis();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/', bookingRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});