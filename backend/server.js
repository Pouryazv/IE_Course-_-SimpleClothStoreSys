require('dotenv').config({ path: './.env.development' });
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const swaggerRoutes = require('./routes/swaggerRoutes'); 
const clothesRoutes = require('./routes/clothesRoutes');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(morgan('tiny'))


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/', authRoutes);

app.use('', swaggerRoutes);

app.use('/', clothesRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
