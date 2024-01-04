require('dotenv').config({ path: './.env.development' });
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const swaggerRoutes = require('./routes/swaggerRoutes'); 

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/auth', authRoutes);

app.use('/api-docs', swaggerRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
