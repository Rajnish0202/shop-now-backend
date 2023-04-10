const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      phoneNo: {
        type: Number,
        required: true,
      },
    },
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
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: 'Not Processed',
      enum: ['Not Processed', 'Processing', 'Cancelled', 'Delivered'],
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cartTotal: Number,
    totalAfterDiscount: Number,
  },
  {
    timestamps: true,
  }
);

//Export the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
