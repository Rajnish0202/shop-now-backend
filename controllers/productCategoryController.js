const asyncHandler = require('express-async-handler');
const ProductCategory = require('../models/productCategoryModel');
const validateMongoDbId = require('../utils/validateMongodbId');

const createCategory = asyncHandler(async (req, res) => {
  const category = await ProductCategory.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const category = await ProductCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(201).json({
    success: true,
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await ProductCategory.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Category Deleted.',
  });
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await ProductCategory.find();

  res.status(200).json({
    success: true,
    categories,
  });
});

const getACategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const category = await ProductCategory.findById(id);

  res.status(200).json({
    success: true,
    category,
  });
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getACategory,
};
