const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: true,
    },
    sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Type',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }],
    ratings: [
      {
        star: Number,
        comment: {
          type: String,
        },
        postedby: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    totalRating: {
      type: Number,
      default: 0,
    },
    special: [
      {
        isSpecial: {
          type: Boolean,
          default: false,
        },
        offer: {
          type: Number,
        },
        specialQty: {
          type: Number,
          default: 0,
        },
        specialTime: {
          type: Date,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

//Export the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
