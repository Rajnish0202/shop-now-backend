const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {},
  },
  {
    timestamps: true,
  }
);

//Export the model
const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
