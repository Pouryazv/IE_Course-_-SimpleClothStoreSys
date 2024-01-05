const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true,
    enum: ['Linen', 'Denim', 'Cotton', 'Leather']
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const Clothes = mongoose.model('Clothes', clothesSchema);

module.exports = Clothes;
