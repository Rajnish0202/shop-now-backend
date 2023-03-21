const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productColorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    hex: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
const Color = mongoose.model('Color', productColorSchema);

module.exports = Color;
