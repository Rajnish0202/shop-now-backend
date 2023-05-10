const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productSizeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
const Size = mongoose.model('Size', productSizeSchema);

module.exports = Size;
