const asyncHandler = require('express-async-handler');
const BlogCategory = require('../models/blogCategory');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');

const createBlogCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(401);
    throw new Error('Category title is required. ');
  }

  const existingCategory = await BlogCategory.findOne({ title });

  if (existingCategory) {
    res.status(200);
    throw new Error('Category already exists');
  }

  const category = await BlogCategory.create({ title, slug: slugify(title) });

  res.status(201).json({
    success: true,
    category,
  });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const category = await BlogCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(201).json({
    success: true,
    category,
  });
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await BlogCategory.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Blog Category Deleted.',
  });
});

const getAllBlogCategory = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    categories,
  });
});

const getABlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const category = await BlogCategory.findById(id);

  res.status(200).json({
    success: true,
    category,
  });
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getAllBlogCategory,
  getABlogCategory,
};
