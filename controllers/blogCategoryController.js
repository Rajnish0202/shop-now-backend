const asyncHandler = require('express-async-handler');
const BlogCategory = require('../models/blogCategory');
const validateMongoDbId = require('../utils/validateMongodbId');

const createBlogCategory = asyncHandler(async (req, res) => {
  const category = await BlogCategory.create(req.body);

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
  const categories = await BlogCategory.find();

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
