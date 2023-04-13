const asyncHandler = require('express-async-handler');
const FaqCategory = require('../models/faqCategoryModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');

const createFaqCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(401);
    throw new Error('Category title is required. ');
  }

  const existingCategory = await FaqCategory.findOne({ title });

  if (existingCategory) {
    res.status(200);
    throw new Error('Category already exists');
  }

  const faqCategory = await FaqCategory.create({ title, slug: slugify(title) });

  res.status(201).json({
    success: true,
    faqCategory,
  });
});

const updateFaqCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const faqCategory = await FaqCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(201).json({
    success: true,
    faqCategory,
  });
});

const deleteFaqCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await FaqCategory.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Faq Category Deleted.',
  });
});

const getAllFaqCategory = asyncHandler(async (req, res) => {
  const faqCategories = await FaqCategory.find();

  const counts = await FaqCategory.countDocuments();

  res.status(200).json({
    success: true,
    faqCategories,
    counts,
  });
});

const getAFaqCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const faqCategory = await FaqCategory.findById(id);

  res.status(200).json({
    success: true,
    faqCategory,
  });
});

module.exports = {
  createFaqCategory,
  updateFaqCategory,
  getAllFaqCategory,
  getAFaqCategory,
  deleteFaqCategory,
};
