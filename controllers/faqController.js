const Faq = require('../models/faqModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const FaqCategory = require('../models/faqCategoryModel');

const createFaq = asyncHandler(async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    // Validation
    switch (true) {
      case !question:
        res.status(400);
        throw new Error('Question is Required.');

      case !answer:
        res.status(400);
        throw new Error('Answer is Required.');

      case !category:
        res.status(400);
        throw new Error('Category is Required.');
    }

    const newFaq = await Faq.create({ answer, question, category });

    res.status(201).json({
      success: true,
      newFaq,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { question, answer, category } = req.body;
  validateMongoDbId(id);

  try {
    // Validation
    switch (true) {
      case !question:
        res.status(400);
        throw new Error('Question is Required.');

      case !answer:
        res.status(400);
        throw new Error('Answer is Required.');

      case !category:
        res.status(400);
        throw new Error('Category is Required.');
    }

    const updateFaq = await Faq.findByIdAndUpdate(
      id,
      { answer, question, category },
      { new: true }
    );

    res.status(201).json({
      success: true,
      updateFaq,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await Faq.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Faq Deleted Successfully.',
  });
  try {
  } catch (error) {
    throw new Error(error);
  }
});

const getAFaq = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await Faq.findById(id);

    if (!faq) {
      res.status(404);
      throw new Error('Faq Not Found.');
    }

    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get ALL product

const getAllFaq = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludeFields = ['limit', 'sort', 'page'];

    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    let query = Faq.find(JSON.parse(queryStr));

    const limit = req.query.limit || 5;

    query = query.limit(limit);

    const faqCount = await Faq.countDocuments();

    const faqCategories = await FaqCategory.aggregate([
      {
        $lookup: {
          from: 'faqs',
          localField: '_id',
          foreignField: 'category',
          as: 'faqs',
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          number_of_faq: { $size: '$faqs' },
        },
      },
    ]);

    const allFaq = await query.populate('category', 'title slug');
    res.status(200).json({
      success: true,
      faqCounts: allFaq.length,
      faqCount,
      allFaq,
      faqCategories,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

module.exports = {
  createFaq,
  updateFaq,
  deleteFaq,
  getAllFaq,
  getAFaq,
};
