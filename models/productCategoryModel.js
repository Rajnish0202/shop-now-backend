const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productCategorySchema = new mongoose.Schema(
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
const ProductCategory = mongoose.model(
  'ProductCategory',
  productCategorySchema
);

module.exports = ProductCategory;
