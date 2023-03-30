const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Color',
        },
        size: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Size',
        },
        price: Number,
      },
    ],
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
