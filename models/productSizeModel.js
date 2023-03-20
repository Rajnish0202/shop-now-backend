const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productSizeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
const Size = mongoose.model('Size', productSizeSchema);

module.exports = Size;
