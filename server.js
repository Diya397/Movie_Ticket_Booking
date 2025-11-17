require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const movieRoutes = require('./routes/movieRoutes');
const movieService = require('./services/movieService');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();
connectRedis().then(() => {
  movieService.subscribeToSeatUpdates();
});

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/', movieRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Movie Service running on port ${PORT}`);
});