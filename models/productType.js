const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {},
  },
  {
    timestamps: true,
  }
);

//Export the model
const Type = mongoose.model('Type', productTypeSchema);

module.exports = Type;
