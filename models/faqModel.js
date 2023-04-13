const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FaqCategory',
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
